import * as D from 'fp-ts/Date';
import * as Eq from 'fp-ts/Eq';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { readEventsFile } from '../infrastructure/events-file';
import * as RI from '../types/review-id';

export type Evaluation = {
  date: Date,
  articleDoi: string,
  evaluationLocator: string,
  authors: ReadonlyArray<string>,
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

const eqEval: Eq.Eq<EvaluationWithPublishedAt> = Eq.struct({
  date: D.Eq,
  articleDoi: S.Eq,
  evaluationLocator: S.Eq,
  authors: RA.getEq(S.Eq),
});

export const fromFile = (path: string): TE.TaskEither<string, ReadonlyArray<EvaluationWithPublishedAt>> => pipe(
  path,
  readEventsFile,
  TE.bimap(
    (errors) => errors.join(', '),
    RA.map(({
      date, articleDoi, evaluationLocator, authors, publishedAt,
    }) => ({
      date,
      articleDoi: articleDoi.value,
      evaluationLocator: RI.serialize(evaluationLocator),
      authors,
      publishedAt,
    })),
  ),
);

type EvaluationWithPublishedAt = Evaluation & { publishedAt: Date };

export const uniq = (
  evaluations: ReadonlyArray<EvaluationWithPublishedAt>,
): ReadonlyArray<EvaluationWithPublishedAt> => pipe(
  evaluations,
  RA.sortBy([byDateAscending, byArticleLocatorAscending]),
  RA.uniq(eqEval),
);
