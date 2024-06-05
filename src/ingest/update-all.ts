import axios from 'axios';
import axiosRetry, { exponentialDelay } from 'axios-retry';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { v4 } from 'uuid';
import { DiscoverPublishedEvaluations } from './discover-published-evaluations';
import { fetchData } from './fetch-data';
import { DiscoveredPublishedEvaluations } from './types/discovered-published-evaluations';
import { Environment } from './validate-environment';

export type GroupIngestionConfiguration = {
  id: string,
  name: string,
  discoverPublishedEvaluations: DiscoverPublishedEvaluations,
};

type LevelName = 'error' | 'warn' | 'info' | 'debug';

const correlationId = v4();

const report = (level: LevelName, message: string) => (payload: Record<string, unknown>) => {
  const thingToLog = {
    timestamp: new Date(),
    level,
    correlationId,
    message,
    payload,
  };
  process.stderr.write(`${JSON.stringify(thingToLog)}\n`);
};

const reportSkippedItems = (
  group: GroupIngestionConfiguration,
) => (
  discoveredPublishedEvaluations: DiscoveredPublishedEvaluations,
) => {
  if (process.env.INGEST_DEBUG && process.env.INGEST_DEBUG.length > 0) {
    pipe(
      discoveredPublishedEvaluations.skipped,
      RA.map((skippedItem) => ({ item: skippedItem.item, reason: skippedItem.reason, groupName: group.name })),
      RA.map(report('debug', 'Ingestion item skipped')),
    );
  }
  return discoveredPublishedEvaluations;
};

type EvaluationCommand = {
  groupId: string,
  expressionDoi: string,
  evaluationLocator: string,
  publishedAt: Date,
  authors: ReadonlyArray<string>,
  evaluationType?: string,
};

axiosRetry(axios, {
  retries: 3,
  retryCondition: () => true,
  retryDelay: exponentialDelay,
  onRetry: (retryCount: number, error) => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    process.stderr.write(`Retrying retryCount: ${retryCount}, error: ${error}, url: ${error.config?.url}, data: ${error.config?.data}\n`);
  },
});

const send = (environment: Environment) => (evaluationCommand: EvaluationCommand) => pipe(
  TE.tryCatch(
    async () => axios.post(`${environment.targetApp}/api/record-evaluation-publication`, JSON.stringify(evaluationCommand), {
      headers: {
        Authorization: `Bearer ${environment.bearerToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    }),
    (error) => {
      if (axios.isAxiosError(error)) {
        return `Failed to post evaluation command: ${String(error)}. Response data is: "${String(error.response?.data)}"`;
      }
      return `Failed to post evaluation command: ${String(error)}`;
    },
  ),
  T.delay(50),
);

const countUniques = (accumulator: Record<string, number>, errorMessage: string) => pipe(
  accumulator,
  R.lookup(errorMessage),
  O.match(
    () => 1,
    (count) => count + 1,
  ),
  (count) => R.upsertAt(errorMessage, count)(accumulator),
);

const sendRecordEvaluationCommands = (
  group: GroupIngestionConfiguration,
  environment: Environment,
) => (discoveredPublishedEvaluations: DiscoveredPublishedEvaluations) => pipe(
  discoveredPublishedEvaluations.understood,
  RA.map((evaluation) => ({
    groupId: group.id,
    expressionDoi: evaluation.paperExpressionDoi,
    evaluationLocator: evaluation.evaluationLocator,
    publishedAt: evaluation.publishedOn,
    authors: evaluation.authors,
    evaluationType: evaluation.evaluationType,
  })),
  T.traverseSeqArray(send(environment)),
  T.map((array) => {
    const leftsCount = RA.lefts(array).length;
    const lefts = pipe(
      array,
      RA.lefts,
      RA.reduce({}, countUniques),
    );
    const rightsCount = RA.rights(array).length;
    const summaryOfRequests = {
      groupName: group.name,
      lefts,
      leftsTotal: leftsCount,
      rightsTotal: rightsCount,
    };
    if (leftsCount > 0) {
      return E.left(summaryOfRequests);
    }
    return E.right(summaryOfRequests);
  }),
);

const updateGroup = (
  environment: Environment,
) => (
  group: GroupIngestionConfiguration,
): TE.TaskEither<unknown, void> => pipe(
  { fetchData },
  group.discoverPublishedEvaluations(environment.ingestDays),
  TE.bimap(
    (error) => ({
      groupName: group.name,
      cause: 'Could not discover any published evaluations',
      error,
    }),
    reportSkippedItems(group),
  ),
  TE.chainW(sendRecordEvaluationCommands(group, environment)),
  TE.bimap(
    report('warn', 'Ingestion failed'),
    report('info', 'Ingestion successful'),
  ),
);

type GroupsToIngest = ReadonlyArray<GroupIngestionConfiguration>;

export const updateAll = (
  environment: Environment,
  groupsToIngest: GroupsToIngest,
): TE.TaskEither<unknown, ReadonlyArray<void>> => pipe(
  groupsToIngest,
  T.traverseSeqArray(updateGroup(environment)),
  T.map(E.sequenceArray),
);
