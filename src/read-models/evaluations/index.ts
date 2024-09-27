import { evaluationsStatus } from './evaluations-status';
import { getEvaluationsByGroup } from './get-evaluations-by-group';
import { getEvaluationsOfExpression } from './get-evaluations-of-expression';
import { getEvaluationsOfMultipleExpressions } from './get-evaluations-of-multiple-expressions';
import { getEvaluationsWithNoType } from './get-evaluations-with-no-type';
import { handleEvent, initialState } from './handle-event';

export const evaluations = {
  queries: {
    evaluationsStatus,
    getEvaluationsOfExpression,
    getEvaluationsOfMultipleExpressions,
    getEvaluationsByGroup,
    getEvaluationsWithNoType,
  },
  initialState,
  handleEvent,
};

export { RecordedEvaluation, byMostRecentlyPublished, isCurationStatement } from './recorded-evaluation';
