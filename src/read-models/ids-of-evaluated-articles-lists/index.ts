import { handleEvent, initialState } from './handle-event.js';
import { getEvaluatedArticlesListIdForGroup } from './get-evaluated-articles-list-id-for-group.js';

export const idsOfEvalutedArticlesLists = {
  queries: {
    getEvaluatedArticlesListIdForGroup,
  },
  initialState,
  handleEvent,
};
