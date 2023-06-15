import { getEvaluationsByGroup } from './get-evaluations-by-group';
import { getEvaluationsForDoi } from './get-evaluations-for-doi';
import { handleEvent, initialState } from './handle-event';

export const evaluations = {
  queries: {
    getEvaluationsForDoi,
    getEvaluationsByGroup,
  },
  initialState,
  handleEvent,
};
