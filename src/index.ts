import { performance } from 'perf_hooks';
import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { addArticleToElifeSubjectAreaList, discoverElifeArticleSubjectArea } from './add-article-to-elife-subject-area-list';
import { DomainEvent } from './domain-events';
import { createRouter } from './http/router';
import { createApplicationServer } from './http/server';
import {
  CollectedPorts, createInfrastructure, Logger, replaceError,
} from './infrastructure';
import { levelNameCodec } from './infrastructure/logger';
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

const appConfigCodec = t.type({
  PRETTY_LOG: tt.withFallback(tt.BooleanFromString, false),
  LOG_LEVEL: tt.withFallback(levelNameCodec, 'debug'),
  CROSSREF_API_BEARER_TOKEN: tt.optionFromNullable(t.string),
  TWITTER_API_BEARER_TOKEN: tt.withFallback(t.string, ''),
});

void pipe(
  process.env,
  appConfigCodec.decode,
  TE.fromEither,
  TE.chain((config) => createInfrastructure({
    logLevel: config.LOG_LEVEL,
    prettyLog: config.PRETTY_LOG,
    crossrefApiBearerToken: config.CROSSREF_API_BEARER_TOKEN,
    twitterApiBearerToken: config.TWITTER_API_BEARER_TOKEN,
  })),
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
