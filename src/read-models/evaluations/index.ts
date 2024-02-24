import { evaluationsStatus } from './evaluations-status.js';
import { getEvaluationsByGroup } from './get-evaluations-by-group.js';
import { getEvaluationsOfExpression } from './get-evaluations-of-expression.js';
import { getEvaluationsOfMultipleExpressions } from './get-evaluations-of-multiple-expressions.js';
import { getEvaluationsWithNoType } from './get-evaluations-with-no-type.js';
import { handleEvent, initialState } from './handle-event.js';

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
