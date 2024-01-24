import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as E from 'fp-ts/Either';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as PE from './paper-expression';
import { ExpressionDoi } from './expression-doi';
import { PaperExpression } from './paper-expression';

export type PublishingHistory = {
  expressions: ReadonlyArray<PE.PaperExpression>,
};

export const getLatestExpression = (history: PublishingHistory): O.Option<PE.PaperExpression> => pipe(
  history.expressions,
  RA.sort(PE.byDateAscending),
  RA.last,
);

export const getAllExpressions = (history: PublishingHistory): ReadonlyArray<PE.PaperExpression> => (
  history.expressions
);

export const getAllExpressionDois = (history: PublishingHistory): ReadonlyArray<ExpressionDoi> => pipe(
  history.expressions,
  RA.map((expression) => expression.expressionDoi),
);

export const getLatestPreprintExpression = (history: PublishingHistory): O.Option<PE.PaperExpression> => pipe(
  history.expressions,
  RA.filter((expression) => expression.expressionType === 'preprint'),
  RA.sort(PE.byDateAscending),
  RA.last,
);

const hasAtLeastOnePreprintExpression = (
  paperExpressions: ReadonlyArray<PaperExpression>,
): boolean => pipe(
  paperExpressions,
  RA.some((paperExpression) => paperExpression.expressionType === 'preprint'),
);

type PublishingHistoryFailure = 'empty-publishing-history' | 'no-preprints-in-publishing-history';

export const fromExpressions = (
  candidateExpressions: ReadonlyArray<PE.PaperExpression>,
): E.Either<PublishingHistoryFailure, PublishingHistory> => pipe(
  candidateExpressions,
  RNEA.fromReadonlyArray,
  E.fromOption(() => 'empty-publishing-history' as const),
  E.filterOrElseW(
    hasAtLeastOnePreprintExpression,
    () => 'no-preprints-in-publishing-history' as const,
  ),
  E.map((expressions) => ({ expressions })),
);
