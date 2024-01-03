import * as O from 'fp-ts/Option';
import { identity, pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { RecordedEvaluation } from '../../types/recorded-evaluation';
import { ExpressionDoi } from '../../types/expression-doi';

type GetEvaluationsOfMultipleExpressions = (expressionDoi: ExpressionDoi) => ReadonlyArray<RecordedEvaluation>;

export const getEvaluationsOfMultipleExpressions = (
  readmodel: ReadModel,
): GetEvaluationsOfMultipleExpressions => (expressionDoi) => pipe(
  readmodel.byArticleId.get(expressionDoi),
  O.fromNullable,
  O.match(
    () => [],
    identity,
  ),
);
