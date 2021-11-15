import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { createRouter } from './http/router';
import { createApplicationServer } from './http/server';
import { createInfrastructure, Logger, replaceError } from './infrastructure';

const terminusOptions = (logger: Logger): TerminusOptions => ({
  onShutdown: async () => {
    logger('debug', 'Shutting server down');
  },
  onSignal: async () => {
    logger('debug', 'Signal received');
  },
  signals: ['SIGINT', 'SIGTERM'],
});

void pipe(
  createInfrastructure({
    crossrefApiBearerToken: O.fromNullable(process.env.CROSSREF_API_BEARER_TOKEN),
    logLevel: process.env.LOG_LEVEL ?? 'debug',
    prettyLog: !!process.env.PRETTY_LOG,
    twitterApiBearerToken: process.env.TWITTER_API_BEARER_TOKEN ?? '',
  }),
  TE.map((adapters) => pipe(
    adapters,
    createRouter,
    (router) => ({ router, adapters }),
  )),
  TE.chainEitherKW(({ adapters, router }) => pipe(
    createApplicationServer(router, adapters),
    E.map(flow(
      (server) => createTerminus(server, terminusOptions(adapters.logger)),
      (server) => server.on('listening', () => adapters.logger('info', 'Server running')),
    )),
  )),
  TE.match(
    (error) => {
      process.stderr.write(`Unable to start:\n${JSON.stringify(error, null, 2)}\n`);
      process.stderr.write(`Error object: ${JSON.stringify(error, replaceError, 2)}\n`);
      return process.exit(1);
    },
    (server) => server.listen(80),
  ),
)();
