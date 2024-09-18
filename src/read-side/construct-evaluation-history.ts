import { pipe } from 'fp-ts/function';
import { Queries } from '../read-models';
import { RecordedEvaluation } from '../read-models/evaluations';
import * as PH from '../types/publishing-history';

export const constructEvaluationHistory = (
  dependencies: Queries,
  history: PH.PublishingHistory,
): ReadonlyArray<RecordedEvaluation> => pipe(
  history,
  PH.getAllExpressionDois,
  dependencies.getEvaluationsOfMultipleExpressions,
);
