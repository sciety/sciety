import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as E from 'fp-ts/Either';
import * as PE from './paper-expression';
import { ExpressionDoi } from './expression-doi';

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

export const fromExpressions = (
  expressions: ReadonlyArray<PE.PaperExpression>,
): E.Either<string, PublishingHistory> => E.right({
  expressions,
});
