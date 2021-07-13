import { Buffer } from 'buffer';
import fs from 'fs';
import csvParseSync from 'csv-parse/lib/sync';
import { printf } from 'fast-printf';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import * as Es from './evaluations';
import { fetchData, FetchData } from './fetch-data';
import { fetchGoogleSheet, FetchGoogleSheet } from './fetch-google-sheet';
import { DoiFromString } from '../types/codecs/DoiFromString';
import * as RI from '../types/review-id';

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

const reviews = t.readonlyArray(t.tuple([
  DateFromISOString,
  DoiFromString,
  RI.reviewIdCodec,
]));

const overwriteCsv = (group: Group) => (evaluations: Es.Evaluations) => pipe(
  `./data/reviews/${group.id}.csv`,
  TE.taskify(fs.readFile),
  T.map(E.orElse(() => E.right(Buffer.from('')))),
  TE.chainEitherKW(flow(
    (fileContents) => csvParseSync(fileContents, { fromLine: 2 }) as unknown,
    reviews.decode,
  )),
  TE.bimap(
    (errors) => PR.failure(errors).join(', '),
    RA.map(([date, articleDoi, evaluationLocator]) => ({
      date,
      articleDoi: articleDoi.value,
      evaluationLocator: RI.serialize(evaluationLocator),
    })),
  ),
  TE.map((existing) => [...existing, ...evaluations]),
  TE.map(Es.toCsv),
  TE.chainW(writeFile(`./data/reviews/${group.id}.csv`)),
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
