import * as D from 'fp-ts/Date';
import * as Eq from 'fp-ts/Eq';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as PR from 'io-ts/PathReporter';
import { readEventsFile } from '../infrastructure/read-events-file';
import * as RI from '../types/review-id';

export type Evaluation = {
  date: Date,
  articleDoi: string,
  evaluationLocator: string,
};

export type Evaluations = ReadonlyArray<Evaluation>;

const byDateAscending: Ord.Ord<Evaluation> = pipe(
  D.Ord,
  Ord.contramap((ev) => ev.date),
);

const byArticleLocatorAscending: Ord.Ord<Evaluation> = pipe(
  S.Ord,
  Ord.contramap((ev) => ev.articleDoi),
);

const eqEval: Eq.Eq<Evaluation> = Eq.struct({
  date: D.Eq,
  articleDoi: S.Eq,
  evaluationLocator: S.Eq,
});

export const fromFile = (path: string): TE.TaskEither<string, Evaluations> => pipe(
  path,
  readEventsFile,
  TE.bimap(
    (errors) => PR.failure(errors).join(', '),
    RA.map(({ date, articleDoi, evaluationLocator }) => ({
      date,
      articleDoi: articleDoi.value,
      evaluationLocator: RI.serialize(evaluationLocator),
    })),
  ),
);

export const uniq = (evaluations: Evaluations): Evaluations => pipe(
  evaluations,
  RA.sortBy([byDateAscending, byArticleLocatorAscending]),
  RA.uniq(eqEval),
);

export const toCsv = (evaluations: Evaluations): string => pipe(
  evaluations,
  RA.map((evaluation) => (
    `${evaluation.date.toISOString()},${evaluation.articleDoi},${evaluation.evaluationLocator}\n`
  )),
  (events) => `Date,Article DOI,Review ID\n${events.join('')}`,
);
