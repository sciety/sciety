import { performance } from 'perf_hooks';
import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import axios from 'axios';
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
import { Doi } from './types/doi';
import { ListId } from './types/list-id';

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

type AddArticleToListCommandPayload = {
  articleId: Doi, listId: ListId,
};

const postAddArticleToListOnScietyApi = (body: { articleId: string, listId: string }) => TE.tryCatch(
  async () => axios.post(`${process.env.SCIETY_API ?? 'http://app'}/add-article-to-list`, JSON.stringify(body), {
    headers: {
      Authorization: `Bearer ${process.env.SCIETY_TEAM_API_BEARER_TOKEN ?? 'secret'}`,
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  }),
  (error) => {
    if (axios.isAxiosError(error)) {
      return `Failed to post addArticleToList command: ${String(error)}. Response data is: "${String(error.response?.data)}"`;
    }
    return `Failed to post addArticleToList command: ${String(error)}`;
  },
);

const executeBackgroundPolicies: ExecuteBackgroundPolicies = (adapters) => async () => {
  type CallAddArticleToList = (payload: AddArticleToListCommandPayload) => TE.TaskEither<string, void>;

  const callAddArticleToList: CallAddArticleToList = (payload) => pipe(
    {
      articleId: payload.articleId.value,
      listId: payload.listId.toString(),
    },
    postAddArticleToListOnScietyApi,
    TE.map(() => undefined),
  );

  const events = await adapters.getAllEvents();
  const amountOfEventsToProcess = 0;
  const start = performance.now();
  // eslint-disable-next-line no-loops/no-loops
  for (let i = 0; i < amountOfEventsToProcess; i += 1) {
    await noopPolicy(events[i])();
    await addArticleToElifeSubjectAreaLists({ callAddArticleToList, ...adapters })(events[i])();
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  }
  const stop = performance.now();
  adapters.logger('info', 'All background policies have completed', { eventsLength: events.length, processedEventsCount: amountOfEventsToProcess, durationInMs: stop - start });
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
