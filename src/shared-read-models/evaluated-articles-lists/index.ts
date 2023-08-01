import { getUnlistedEvaluatedArticles } from './get-unlisted-evaluated-articles';
import { handleEvent, initialState } from './handle-event';
import { unlistedArticlesStatus } from './unlisted-articles-status';

export const evaluatedArticlesLists = {
  queries: {
    getUnlistedEvaluatedArticles,
    unlistedArticlesStatus,
  },
  initialState,
  handleEvent,
};
