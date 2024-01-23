import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as PE from './paper-expression';
import { ExpressionDoi } from './expression-doi';

type PaperExpressions = {
  expressions: ReadonlyArray<PE.PaperExpression>,
};

export const getLatestExpression = (paperExpressions: PaperExpressions): O.Option<PE.PaperExpression> => pipe(
  paperExpressions.expressions,
  RA.sort(PE.byDateAscending),
  RA.last,
);

export const getAllExpressionDois = (paperExpressions: PaperExpressions): ReadonlyArray<ExpressionDoi> => pipe(
  paperExpressions.expressions,
  RA.map((expression) => expression.expressionDoi),
);

export const getLatestPreprintExpression = (paperExpressions: PaperExpressions): O.Option<PE.PaperExpression> => pipe(
  paperExpressions.expressions,
  RA.filter((expression) => expression.expressionType === 'preprint'),
  RA.sort(PE.byDateAscending),
  RA.last,
);
