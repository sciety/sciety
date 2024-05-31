import { handleEvent, initialState } from './handle-event';
import { selectAllListsPromotedByGroup } from './select-all-lists-promoted-by-group';

export const listPromotions = {
  queries: {
    selectAllListsPromotedByGroup,
  },
  initialState,
  handleEvent,
};
