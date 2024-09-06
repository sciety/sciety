import { URL } from 'url';
import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { environmentVariablesCodec } from './http/environment-variables-codec';
import { createRouter } from './http/router';
import { createApplicationServer } from './http/server';
import { createInfrastructure, replacer } from './infrastructure';
import { defaultLogLevel, Logger } from './logger';
import { scheduleSagas } from './sagas';

const terminusOptions = (logger: Logger): TerminusOptions => ({
  onShutdown: async () => {
    logger('debug', 'Shutting server down');
  },
  onSignal: async () => {
    logger('debug', 'Signal received');
  },
  signals: ['SIGINT', 'SIGTERM'],
  useExit0: true,
});

void pipe(
  createInfrastructure({
    crossrefApiBearerToken: O.fromNullable(process.env.CROSSREF_API_BEARER_TOKEN),
    useStubAdapters: process.env.USE_STUB_ADAPTERS === 'true',
    useStubAvatars: process.env.USE_STUB_AVATARS === 'true',
    logLevel: process.env.LOG_LEVEL ?? defaultLogLevel,
    prettyLog: !!process.env.PRETTY_LOG,
  }),
  TE.map((adapters) => {
    adapters.logger('info', 'Created infrastructure');
    return adapters;
  }),
  TE.chainEitherKW((adapters) => pipe(
    process.env,
    environmentVariablesCodec.decode,
    E.bimap(
      formatValidationErrors,
      (config) => ({
        adapters,
        config,
      }),
    ),
  )),
  TE.map(({ adapters, config }) => pipe(
    createRouter(adapters, config),
    (router) => ({ router, adapters, config }),
  )),
  TE.chainEitherKW(({ adapters, router, config }) => pipe(
    createApplicationServer(router, adapters, config),
    E.map(flow(
      (server) => createTerminus(server, terminusOptions(adapters.logger)),
      (server) => server.on('listening', () => adapters.logger('info', 'Server running')),
    )),
    E.map((server) => ({
      server,
      adapters,
      config,
    })),
  )),
  TE.match(
    (error) => {
      process.stderr.write(`Unable to start:\n${JSON.stringify(error, null, 2)}\n`);
      process.stderr.write(`Error object: ${JSON.stringify(error, replacer, 2)}\n`);
      return process.exit(1);
    },
    ({ server, adapters, config }) => {
      server.listen(80);
      return {
        dependenciesForSagas: adapters,
        config,
      };
    },
  ),
  T.chain(({ dependenciesForSagas, config }) => scheduleSagas(
    dependenciesForSagas,
    new URL(config.APP_ORIGIN),
  )),
)();
