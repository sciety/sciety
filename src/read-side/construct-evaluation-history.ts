import { pipe } from 'fp-ts/function';
import { Dependencies } from '../html-pages/paper-activity-page/construct-view-model/dependencies';
import * as PH from '../types/publishing-history';
import { RecordedEvaluation } from '../types/recorded-evaluation';

export const constructEvaluationHistory = (
  dependencies: Dependencies,
  history: PH.PublishingHistory,
): ReadonlyArray<RecordedEvaluation> => pipe(
  history,
  PH.getAllExpressionDois,
  dependencies.getEvaluationsOfMultipleExpressions,
);
