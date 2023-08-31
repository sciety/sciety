import { getActivityForGroup } from './get-activity-for-group';
import { handleEvent, initialState } from './handle-event';

export const groupActivity = {
  queries: {
    getActivityForGroup,
  },
  initialState,
  handleEvent,
};
