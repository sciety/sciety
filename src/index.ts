import { Server } from 'http';
import { performance } from 'perf_hooks';
import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import Router from '@koa/router';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { addArticleToElifeSubjectAreaList, discoverElifeArticleSubjectArea } from './add-article-to-elife-subject-area-list';
import { appConfigCodec } from './app-config';
import { DomainEvent } from './domain-events';
import { createRouter } from './http/router';
import { createApplicationServer } from './http/server';
import {
  CollectedPorts, createInfrastructure, Logger, replaceError,
} from './infrastructure';
import { ensureAllUsersHaveCreatedAccountEvents } from './policies/ensure-all-users-have-accounts';

const terminusOptions = (logger: Logger): TerminusOptions => ({
  onShutdown: async () => {
    logger('debug', 'Shutting server down');
  },
  onSignal: async () => {
    logger('debug', 'Signal received');
  },
  signals: ['SIGINT', 'SIGTERM'],
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
  await ensureAllUsersHaveCreatedAccountEvents(events, ports)();
  const stop = performance.now();
  ports.logger('info', 'All background policies have completed', { eventsLength: events.length, processedEventsCount: amountOfEventsToProcess, durationInMs: stop - start });
};

const startSagas = (ports: CollectedPorts) => async () => {
  ports.logger('info', 'Starting sagas');
  setInterval(async () => discoverElifeArticleSubjectArea(ports), 661 * 1000);
  setInterval(async () => addArticleToElifeSubjectAreaList(ports), 13 * 60 * 1000);
  ports.logger('info', 'Sagas started');
};

const createServer = (router: Router, adapters: CollectedPorts): E.Either<string, Server> => pipe(
  createApplicationServer(router, adapters),
  E.map((server) => createTerminus(server, terminusOptions(adapters.logger))),
  E.map((server) => server.on('listening', () => adapters.logger('info', 'Server running'))),
);

const logAndExit = (error: unknown) => {
  process.stderr.write(`Unable to start:\n${JSON.stringify(error, null, 2)}\n`);
  process.stderr.write(`Error object: ${JSON.stringify(error, replaceError, 2)}\n`);
  return process.exit(1);
};

const startServer = (server: Server) => { server.listen(80); return T.of(undefined); };

void pipe(
  TE.Do,
  TE.bind('config', () => TE.fromEither(appConfigCodec.decode(process.env))),
  TE.bind('adapters', ({ config }) => createInfrastructure(config)),
  TE.bind('router', ({ config, adapters }) => TE.right(createRouter(config, adapters))),
  TE.bindW('server', ({ router, adapters }) => TE.fromEither(createServer(router, adapters))),
  TE.getOrElse(logAndExit),
  T.chainFirst(({ server }) => startServer(server)),
  T.chainFirst(({ adapters }) => executeBackgroundPolicies(adapters)),
  T.chain(({ adapters }) => startSagas(adapters)),
)();
