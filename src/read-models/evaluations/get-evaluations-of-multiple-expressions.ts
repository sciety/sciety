import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { ReadModel } from './handle-event';
import { RecordedEvaluation } from '../../types/recorded-evaluation';
import { ExpressionDoi } from '../../types/expression-doi';

type GetEvaluationsOfMultipleExpressions = (
  expressionDois: ReadonlyArray<ExpressionDoi>
) => ReadonlyArray<RecordedEvaluation>;

export const getEvaluationsOfMultipleExpressions = (
  readmodel: ReadModel,
): GetEvaluationsOfMultipleExpressions => (expressionDois) => pipe(
  expressionDois,
  RA.flatMap((expressionDoi) => readmodel.byArticleId.get(expressionDoi) ?? []),
);
