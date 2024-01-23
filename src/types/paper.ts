import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as PE from './paper-expression';
import { ExpressionDoi } from './expression-doi';

type Paper = {
  expressions: ReadonlyArray<PE.PaperExpression>,
};

export const getLatestExpression = (paper: Paper): O.Option<PE.PaperExpression> => pipe(
  paper.expressions,
  RA.sort(PE.byDateAscending),
  RA.last,
);

export const getAllExpressionDois = (paper: Paper): ReadonlyArray<ExpressionDoi> => pipe(
  paper.expressions,
  RA.map((expression) => expression.expressionDoi),
);
