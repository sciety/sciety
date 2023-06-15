import { handleEvent, initialState } from './handle-event';
import { lookupList } from './lookup-list';
import { selectListContainingArticle } from './select-list-containing-article';
import { selectAllListsOwnedBy } from './select-all-lists-owned-by';
import { getNonEmptyUserLists } from './get-non-empty-user-lists';
import { selectAllListsContainingArticle } from './select-all-lists-containing-article';

export const lists = {
  queries: {
    getNonEmptyUserLists,
    lookupList,
    selectAllListsContainingArticle,
    selectAllListsOwnedBy,
    selectListContainingArticle,
  },
  initialState,
  handleEvent,
};
