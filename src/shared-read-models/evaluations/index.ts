import { evaluationsStatus } from './evaluations-status';
import { getEvaluationsByGroup } from './get-evaluations-by-group';
import { getEvaluationsForDoi } from './get-evaluations-for-doi';
import { handleEvent, initialState } from './handle-event';

export const evaluations = {
  queries: {
    evaluationsStatus,
    getEvaluationsForDoi,
    getEvaluationsByGroup,
  },
  initialState,
  handleEvent,
};
