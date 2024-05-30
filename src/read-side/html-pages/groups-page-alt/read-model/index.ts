import { getGroupCardsForAllGroups } from './get-group-cards-for-all-groups';
import { handleEvent, initialState } from './handle-event';

export const groupCards = {
  queries: {
    getGroupCardsForAllGroups,
  },
  initialState,
  handleEvent,
};
