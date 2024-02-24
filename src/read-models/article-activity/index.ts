import { getActivityForExpressionDoi } from './get-activity-for-expression-doi.js';
import { handleEvent, initialState } from './handle-event.js';

export const articleActivity = {
  queries: {
    getActivityForExpressionDoi,
  },
  initialState,
  handleEvent,
};
