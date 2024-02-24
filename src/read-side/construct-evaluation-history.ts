import { pipe } from 'fp-ts/function';
import { Queries } from '../read-models/index.js';
import * as PH from '../types/publishing-history.js';
import { RecordedEvaluation } from '../types/recorded-evaluation.js';

export const constructEvaluationHistory = (
  dependencies: Queries,
  history: PH.PublishingHistory,
): ReadonlyArray<RecordedEvaluation> => pipe(
  history,
  PH.getAllExpressionDois,
  dependencies.getEvaluationsOfMultipleExpressions,
);
