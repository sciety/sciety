import fs from 'fs';
import { printf } from 'fast-printf';
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

export type FetchEvaluations = (adapters: Adapters) => TE.TaskEither<string, Es.Evaluations>;

export type Group = {
  id: string,
  name: string,
  fetchFeed: FetchEvaluations,
};

const writeFile = (path: string) => (contents: string) => TE.taskify(fs.writeFile)(path, contents);

const overwriteCsv = (group: Group) => (evaluations: Es.Evaluations) => pipe(
  `./data/reviews/${group.id}.csv`,
  Es.fromFile,
  TE.map((existing) => pipe(
    [...existing, ...evaluations],
    Es.uniq,
    (all) => ({
      all,
      existing,
    }),
  )),
  TE.chain((results) => pipe(
    results.all,
    Es.toCsv,
    writeFile(`./data/reviews/${group.id}.csv`),
    TE.bimap(
      (error) => error.toString(),
      () => ({
        total: results.all.length,
        added: results.all.length - results.existing.length,
      }),
    ),
  )),
);

const report = (group: Group) => (message: string) => {
  process.stderr.write(printf('%-30s %s\n', group.name, message));
};

type Results = {
  total: number,
  added: number,
};

const reportSuccess = (group: Group) => (results: Results) => pipe(
  printf('%5d evaluations (%d new)', results.total, results.added),
  report(group),
);

const updateGroup = (group: Group): T.Task<void> => pipe(
  group.fetchFeed({
    fetchData,
    fetchGoogleSheet,
  }),
  TE.chain(overwriteCsv(group)),
  TE.match(
    report(group),
    reportSuccess(group),
  ),
);

export const updateAll = (groups: ReadonlyArray<Group>): T.Task<ReadonlyArray<void>> => pipe(
  groups,
  T.traverseArray(updateGroup),
);
