import { performance } from 'perf_hooks';
import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { DomainEvent } from './domain-events';
import { createRouter } from './http/router';
import { createApplicationServer } from './http/server';
import {
  Adapters, createInfrastructure, Logger, replaceError,
} from './infrastructure';
import { addArticleToElifeSubjectAreaLists } from './policies/add-article-to-elife-subject-area-lists';

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

type ExecuteBackgroundPolicies = (adapters: Adapters) => T.Task<void>;

const executeBackgroundPolicies: ExecuteBackgroundPolicies = (adapters) => async () => {
  const events = await adapters.getAllEvents();
  const start = performance.now();
  // eslint-disable-next-line no-loops/no-loops
  for (let i = 0; i < Math.min(events.length, 100); i += 1) {
    await noopPolicy(events[i])();
    await addArticleToElifeSubjectAreaLists(adapters)(events[i])();
    await new Promise((resolve) => {
      setTimeout(resolve, 10);
    });
  }
  const stop = performance.now();
  adapters.logger('info', 'All background policies have completed', { eventsLength: events.length, durationInMs: stop - start });
};

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
  T.chain(executeBackgroundPolicies),
)();
