import fs from 'fs';
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

const writeFile = (path: string) => (contents: string) => TE.taskify(fs.writeFile)(path, contents);

const overwriteCsv = (group: Group) => (feedData: FeedData) => pipe(
  `./data/reviews/${group.id}.csv`,
  Es.fromFile,
  TE.map((existing) => pipe(
    [...existing, ...feedData.evaluations],
    Es.uniq,
    (all) => ({
      all,
      existing,
      skippedItems: feedData.skippedItems,
    }),
  )),
  TE.chain((results) => pipe(
    results.all,
    Es.toCsv,
    writeFile(`./data/reviews/${group.id}.csv`),
    TE.bimap(
      (error) => error.toString(),
      () => ({
        evaluationsCount: results.all.length,
        newEvaluationsCount: results.all.length - results.existing.length,
        skippedItemsCount: results.skippedItems.length,
      }),
    ),
  )),
);

const report = (group: Group) => (message: string) => {
  process.stderr.write(printf('%-36s %s\n', chalk.white(group.name), message));
};

const reportError = (group: Group) => (message: string) => pipe(
  chalk.redBright(message),
  report(group),
);

type Results = {
  evaluationsCount: number,
  newEvaluationsCount: number,
  skippedItemsCount: number,
};

const reportSuccess = (group: Group) => (results: Results) => pipe(
  printf('%5d evaluations (%s, %s existing, %s)',
    results.evaluationsCount,
    chalk.green(`${results.newEvaluationsCount} new`),
    chalk.white(results.evaluationsCount - results.newEvaluationsCount),
    chalk.yellow(`${results.skippedItemsCount} skipped`)),
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

const updateGroup = (group: Group): T.Task<void> => pipe(
  group.fetchFeed({
    fetchData,
    fetchGoogleSheet,
  }),
  TE.map(reportSkippedItems(group)),
  TE.chain(overwriteCsv(group)),
  TE.match(
    reportError(group),
    reportSuccess(group),
  ),
);

export const updateAll = (groups: ReadonlyArray<Group>): T.Task<ReadonlyArray<void>> => pipe(
  groups,
  T.traverseArray(updateGroup),
);
