import axios from 'axios';
import chalk from 'chalk';
import { printf } from 'fast-printf';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as Es from './evaluations';
import { fetchData, FetchData } from './fetch-data';
import { fetchGoogleSheet, FetchGoogleSheet } from './fetch-google-sheet';

type Adapters = {
  fetchData: FetchData,
  fetchGoogleSheet: FetchGoogleSheet,
};

export type SkippedItem = {
  item: string,
  reason: string,
};

export type FeedData = {
  evaluations: Es.Evaluations,
  skippedItems: ReadonlyArray<SkippedItem>,
};

export type FetchEvaluations = (adapters: Adapters) => TE.TaskEither<string, FeedData>;

export type Group = {
  id: string,
  name: string,
  fetchFeed: FetchEvaluations,
};

const report = (group: Group) => (message: string) => {
  process.stderr.write(printf('%-36s %s\n', chalk.white(group.name), message));
};

const reportError = (group: Group) => (message: string) => pipe(
  chalk.redBright(message),
  report(group),
);

const reportSuccess = (group: Group) => () => pipe(
  '',
  report(group),
);

const reportSkippedItems = (group: Group) => (feedData: FeedData) => {
  if (process.env.INGEST_DEBUG && process.env.INGEST_DEBUG.length > 0) {
    pipe(
      feedData.skippedItems,
      RA.map((item) => chalk.cyan(`Skipped '${item.item}' -- ${item.reason}`)),
      RA.map(report(group)),
    );
  }
  return feedData;
};

type EvaluationCommand = {
  groupId: string,
  articleId: string,
  evaluationLocator: string,
  publishedAt: Date,
  authors: ReadonlyArray<string>,
};

const send = (evaluationCommand: EvaluationCommand) => TE.tryCatch(
  async () => axios.post('https://sciety.org/record-evaluation', JSON.stringify(evaluationCommand), {
    headers: {
      Authorization: `Bearer ${process.env.INGESTION_AUTH_BEARER_TOKEN ?? 'secret'}`,
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  }),
  String,
);

const sendRecordEvaluationCommands = (group: Group) => (feedData: FeedData) => pipe(
  feedData.evaluations,
  RA.map((evaluation) => ({
    groupId: group.id,
    articleId: evaluation.articleDoi,
    evaluationLocator: evaluation.evaluationLocator,
    publishedAt: evaluation.date,
    authors: evaluation.authors,
  })),
  TE.traverseArray(send),
);

const updateGroup = (group: Group): T.Task<void> => pipe(
  group.fetchFeed({
    fetchData,
    fetchGoogleSheet,
  }),
  TE.map(reportSkippedItems(group)),
  TE.chainFirstW(sendRecordEvaluationCommands(group)),
  TE.match(
    reportError(group),
    reportSuccess(group),
  ),
);

export const updateAll = (groups: ReadonlyArray<Group>): T.Task<ReadonlyArray<void>> => pipe(
  groups,
  T.traverseArray(updateGroup),
);
