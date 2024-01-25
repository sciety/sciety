import { pipe } from 'fp-ts/function';
import { Queries } from '../read-models';
import * as PH from '../types/publishing-history';
import { RecordedEvaluation } from '../types/recorded-evaluation';

export const constructEvaluationHistory = (
  dependencies: Queries,
  history: PH.PublishingHistory,
): ReadonlyArray<RecordedEvaluation> => pipe(
  history,
  PH.getAllExpressionDois,
  dependencies.getEvaluationsOfMultipleExpressions,
);
