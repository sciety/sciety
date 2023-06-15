import { handleEvent, initialState } from './handle-event';
import { getEvaluatedArticlesListIdForGroup } from './get-evaluated-articles-list-id-for-group';

export const idsOfEvalutedArticlesLists = {
  queries: {
    getEvaluatedArticlesListIdForGroup,
  },
  initialState,
  handleEvent,
};
