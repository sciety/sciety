import { performance } from 'perf_hooks';
import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { DomainEvent } from './domain-events';
import { createRouter } from './http/router';
import { createApplicationServer } from './http/server';
import {
  CollectedPorts, createInfrastructure, replaceError,
} from './infrastructure';
import { environmentVariablesCodec } from './http/environment-variables-codec';
import { startSagas } from './sagas';
import { Logger } from './shared-ports';

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

type NoopPolicy = (event: DomainEvent) => T.Task<void>;

const noopPolicy: NoopPolicy = () => T.of(undefined);

type ExecuteBackgroundPolicies = (ports: CollectedPorts) => T.Task<void>;

const executeBackgroundPolicies: ExecuteBackgroundPolicies = (ports) => async () => {
  const events = await ports.getAllEvents();
  // const amountOfEventsToProcess = events.length;
  const amountOfEventsToProcess = 0;
  const start = performance.now();
  // eslint-disable-next-line no-loops/no-loops
  for (let i = 0; i < amountOfEventsToProcess; i += 1) {
    await noopPolicy(events[i])();
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  }
  const stop = performance.now();
  ports.logger('info', 'All background policies have completed', { eventsLength: events.length, processedEventsCount: amountOfEventsToProcess, durationInMs: stop - start });
};

void pipe(
  createInfrastructure({
    crossrefApiBearerToken: O.fromNullable(process.env.CROSSREF_API_BEARER_TOKEN),
    minimumLogLevel: process.env.LOG_LEVEL ?? 'debug',
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
    })),
  )),
  TE.match(
    (error) => {
      process.stderr.write(`Unable to start:\n${JSON.stringify(error, null, 2)}\n`);
      process.stderr.write(`Error object: ${JSON.stringify(error, replaceError, 2)}\n`);
      return process.exit(1);
    },
    ({ server, adapters }) => { server.listen(80); return adapters; },
  ),
  T.chainFirst(executeBackgroundPolicies),
  T.chain(startSagas),
)();
