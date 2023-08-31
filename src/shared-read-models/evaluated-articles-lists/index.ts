import { getUnlistedEvaluatedArticles } from './get-unlisted-evaluated-articles';
import { handleEvent, initialState } from './handle-event';

export const evaluatedArticlesLists = {
  queries: {
    getUnlistedEvaluatedArticles,
  },
  initialState,
  handleEvent,
};
