import * as O from 'fp-ts/Option';
import { identity, pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { ExpressionDoi } from '../../types/expression-doi';
import { RecordedEvaluation } from '../../types/recorded-evaluation';

type GetEvaluationsOfExpression = (expressionDoi: ExpressionDoi) => ReadonlyArray<RecordedEvaluation>;

export const getEvaluationsOfExpression = (readmodel: ReadModel): GetEvaluationsOfExpression => (expressionDoi) => pipe(
  readmodel.byExpressionDoi.get(expressionDoi),
  O.fromNullable,
  O.match(
    () => [],
    identity,
  ),
);
