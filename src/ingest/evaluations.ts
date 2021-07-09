import * as D from 'fp-ts/Date';
import * as Eq from 'fp-ts/Eq';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';

type Evaluation = {
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

export const toCsv = (evaluations: Evaluations): string => pipe(
  evaluations,
  RA.sortBy([byDateAscending, byArticleLocatorAscending]),
  RA.uniq(eqEval),
  RA.map((evaluation) => (
    `${evaluation.date.toISOString()},${evaluation.articleDoi},${evaluation.evaluationLocator}\n`
  )),
  (events) => `Date,Article DOI,Review ID\n${events.join('')}`,
);
