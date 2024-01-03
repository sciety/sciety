import * as O from 'fp-ts/Option';
import { identity, pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { RecordedEvaluation } from '../../types/recorded-evaluation';
import { ExpressionDoi } from '../../types/expression-doi';

type GetEvaluationsOfMultipleExpressions = (
  expressionDois: ReadonlyArray<ExpressionDoi>
) => ReadonlyArray<RecordedEvaluation>;

export const getEvaluationsOfMultipleExpressions = (
  readmodel: ReadModel,
): GetEvaluationsOfMultipleExpressions => (expressionDois) => pipe(
  readmodel.byArticleId.get(expressionDois[0]),
  O.fromNullable,
  O.match(
    () => [],
    identity,
  ),
);
