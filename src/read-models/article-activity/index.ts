import { getActivityForExpressionDoi } from './get-activity-for-expression-doi';
import { handleEvent, initialState } from './handle-event';

export const articleActivity = {
  queries: {
    getActivityForExpressionDoi,
  },
  initialState,
  handleEvent,
};
