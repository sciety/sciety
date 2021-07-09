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

const writeCsv = (group: Group) => (evaluations: Es.Evaluations) => pipe(
  evaluations,
  Es.toCsv,
  writeFile(`./data/reviews/${group.id}.csv`),
  TE.bimap(
    (error) => error.toString(),
    () => evaluations,
  ),
);

const report = (group: Group) => (message: string) => {
  process.stderr.write(printf('%-30s %s\n', group.name, message));
};

const reportSuccess = (group: Group) => (evaluations: Es.Evaluations) => pipe(
  printf('%5d evaluations', evaluations.length),
  report(group),
);

const updateGroup = (group: Group): T.Task<void> => pipe(
  group.fetchFeed({
    fetchData,
    fetchGoogleSheet,
  }),
  TE.chain(writeCsv(group)),
  TE.match(
    report(group),
    reportSuccess(group),
  ),
);

export const updateAll = (groups: ReadonlyArray<Group>): T.Task<ReadonlyArray<void>> => pipe(
  groups,
  T.traverseArray(updateGroup),
);
