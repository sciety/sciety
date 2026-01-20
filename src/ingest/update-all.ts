import axios from 'axios';
import axiosRetry, { exponentialDelay } from 'axios-retry';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DiscoverPublishedEvaluations } from './discover-published-evaluations';
import { fetchData } from './fetch-data';
import { fetchHead } from './fetch-head';
import { Configuration, RecordingConfiguration } from './generate-configuration-from-environment';
import { report } from './report';
import { DiscoveredPublishedEvaluations } from './types/discovered-published-evaluations';

type Group = {
  groupId: string,
  name: string,
};

export type EvaluationDiscoveryProcess = Group & {
  discoverPublishedEvaluations: DiscoverPublishedEvaluations,
};

const reportSkippedItems = (
  ingestDebug: Configuration['ingestDebug'],
  group: Group,
) => (
  discoveredPublishedEvaluations: DiscoveredPublishedEvaluations,
) => {
  if (ingestDebug) {
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
    report('warn', 'Retrying HTTP request')({
      retryCount,
      error: error.message,
      url: error.config?.url,
      data: error.config?.data,
    });
  },
});

const send = (configuration: RecordingConfiguration) => (evaluationCommand: EvaluationCommand) => pipe(
  TE.tryCatch(
    async () => axios.post(`${configuration.targetApp}/api/record-evaluation-publication`, JSON.stringify(evaluationCommand), {
      headers: {
        Authorization: `Bearer ${configuration.bearerToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 20000,
    }),
    (error) => {
      if (axios.isAxiosError(error)) {
        return `Failed to post evaluation command: ${String(error)}. Response data is: "${JSON.stringify(error.response?.data)}"`;
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
  group: Group,
  configuration: RecordingConfiguration,
) => (discoveredPublishedEvaluations: DiscoveredPublishedEvaluations) => pipe(
  discoveredPublishedEvaluations.understood,
  RA.map((evaluation) => ({
    groupId: group.groupId,
    expressionDoi: evaluation.paperExpressionDoi,
    evaluationLocator: evaluation.evaluationLocator,
    publishedAt: evaluation.publishedOn,
    authors: evaluation.authors,
    evaluationType: evaluation.evaluationType,
  })),
  T.traverseSeqArray(send(configuration)),
  T.map((array) => {
    const leftsCount = RA.lefts(array).length;
    const lefts = pipe(
      array,
      RA.lefts,
      RA.reduce({}, countUniques),
    );
    const rightsCount = RA.rights(array).length;
    const summary = {
      groupName: group.name,
      lefts,
      leftsTotal: leftsCount,
      rightsTotal: rightsCount,
      skippedTotal: discoveredPublishedEvaluations.skipped.length,
    };
    if (leftsCount > 0) {
      return E.left(summary);
    }
    return E.right(summary);
  }),
);

export const recordEvaluations = (
  group: Group, configuration: RecordingConfiguration,
) => (
  input: E.Either<string, DiscoveredPublishedEvaluations>,
): TE.TaskEither<void, void> => pipe(
  input,
  TE.fromEither,
  TE.bimap(
    (error) => ({
      processName: group.name,
      cause: 'Could not discover any published evaluations',
      error,
    }),
    reportSkippedItems(configuration.ingestDebug, group),
  ),
  TE.chainW(sendRecordEvaluationCommands(group, configuration)),
  TE.bimap(
    report('warn', 'Ingestion failed'),
    report('info', 'Ingestion successful'),
  ),
);

const discoverAndRecordEvaluations = (
  environment: Configuration,
) => (
  process: EvaluationDiscoveryProcess,
): TE.TaskEither<unknown, void> => pipe(
  {
    fetchData: fetchData(environment.ingestDebug),
    fetchHead: fetchHead(environment.ingestDebug),
  },
  process.discoverPublishedEvaluations(environment.ingestDays),
  T.chain(recordEvaluations(process, environment)),
);

export const updateAll = (
  environment: Configuration,
  evaluationDiscoveryProcesses: ReadonlyArray<EvaluationDiscoveryProcess>,
): TE.TaskEither<unknown, ReadonlyArray<void>> => pipe(
  evaluationDiscoveryProcesses,
  T.traverseSeqArray(discoverAndRecordEvaluations(environment)),
  T.map(E.sequenceArray),
);
