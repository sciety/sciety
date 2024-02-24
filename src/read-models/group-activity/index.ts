import { getActivityForGroup } from './get-activity-for-group.js';
import { handleEvent, initialState } from './handle-event.js';

export const groupActivity = {
  queries: {
    getActivityForGroup,
  },
  initialState,
  handleEvent,
};
