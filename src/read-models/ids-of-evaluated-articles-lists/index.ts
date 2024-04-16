import { getEvaluatedArticlesListIdForGroup } from './get-evaluated-articles-list-id-for-group';
import { handleEvent, initialState } from './handle-event';

export const idsOfEvalutedArticlesLists = {
  queries: {
    getEvaluatedArticlesListIdForGroup,
  },
  initialState,
  handleEvent,
};
