import { getActivityForArticle } from './get-activity-for-article.js';
import { handleEvent, initialState } from './handle-event.js';

export const articleActivity = {
  queries: {
    getActivityForDoi: getActivityForArticle,
  },
  initialState,
  handleEvent,
};
