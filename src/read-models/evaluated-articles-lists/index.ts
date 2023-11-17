import { getUnlistedEvaluatedArticles } from './get-unlisted-evaluated-articles.js';
import { handleEvent, initialState } from './handle-event.js';

export const evaluatedArticlesLists = {
  queries: {
    getUnlistedEvaluatedArticles,
  },
  initialState,
  handleEvent,
};
