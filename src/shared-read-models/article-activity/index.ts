import { getActivityForDoi } from './get-activity-for-doi';
import { handleEvent, initialState } from './handle-event';

export const articleActivity = {
  queries: {
    getActivityForDoi,
  },
  initialState,
  handleEvent,
};
