import { EvaluationLocator, toEvaluationLocator } from '../../types/evaluation-locator';
import { ExpressionDoi } from '../../types/expression-doi';
import * as EDOI from '../../types/expression-doi';

export type RecordedEvaluation = {
  expressionDoi: ExpressionDoi,
  evaluationLocator: EvaluationLocator,
};

export const getRecordedEvaluationsForExternalNotifications = [
  {
    expressionDoi: EDOI.fromValidatedString('10.1101/2024.04.03.24305276'),
    evaluationLocator: toEvaluationLocator('doi:10.5281/zenodo.13274625'),
  },
  {
    expressionDoi: EDOI.fromValidatedString('10.1101/2024.04.03.24305276'),
    evaluationLocator: toEvaluationLocator('doi:10.5281/zenodo.12958884'),
  },
  {
    expressionDoi: EDOI.fromValidatedString('10.1101/2024.05.07.592993'),
    evaluationLocator: toEvaluationLocator('doi:10.5281/zenodo.11644732'),
  },
] satisfies ReadonlyArray<RecordedEvaluation>;
