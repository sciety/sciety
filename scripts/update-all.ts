import fs from 'fs';
import { printf } from 'fast-printf';
import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';

type Evaluation = {
  date: Date,
  articleDoi: string,
  evaluationLocator: string,
};

export type FetchEvaluations = TE.TaskEither<string, Array<Evaluation>>;

export type Group = {
  id: string,
  name: string,
  fetchFeed: FetchEvaluations,
};

const writeFile = (path: string) => (contents: string) => TE.taskify(fs.writeFile)(path, contents);

const byDateAscending: Ord.Ord<Evaluation> = pipe(
  D.Ord,
  Ord.contramap((ev) => ev.date),
);

const byArticleLocatorAscending: Ord.Ord<Evaluation> = pipe(
  S.Ord,
  Ord.contramap((ev) => ev.articleDoi),
);

const writeCsv = (group: Group) => (evaluations: ReadonlyArray<Evaluation>) => pipe(
  evaluations,
  RA.sortBy([byDateAscending, byArticleLocatorAscending]),
  RA.map((evaluation) => (
    `${evaluation.date.toISOString()},${evaluation.articleDoi},${evaluation.evaluationLocator}\n`
  )),
  (events) => `Date,Article DOI,Review ID\n${events.join('')}`,
  writeFile(`./data/reviews/${group.id}.csv`),
  TE.bimap(
    (error) => error.toString(),
    () => evaluations,
  ),
);

const report = (group: Group) => (message: string) => {
  process.stderr.write(printf('%-30s %s\n', group.name, message));
};

const reportSuccess = (group: Group) => (evaluations: ReadonlyArray<Evaluation>) => pipe(
  printf('%5d evaluations', evaluations.length),
  report(group),
);

const updateGroup = (group: Group): T.Task<void> => pipe(
  group.fetchFeed,
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
