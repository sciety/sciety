import { getActivityForArticle } from './get-activity-for-article';
import { handleEvent, initialState } from './handle-event';

export const articleActivity = {
  queries: {
    getActivityForExpressionDoi: getActivityForArticle,
  },
  initialState,
  handleEvent,
};
