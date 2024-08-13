import { getPapersEvaluatedByGroup } from './get-papers-evaluated-by-group';
import { handleEvent, initialState } from './handle-event';

export const papersEvaluatedByGroup = {
  queries: {
    getPapersEvaluatedByGroup,
  },
  initialState,
  handleEvent,
};
