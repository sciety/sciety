import { handleEvent, initialState } from './handle-event';
import { lookupList } from './lookup-list';
import { selectListContainingArticle } from './select-list-containing-article';
import { selectAllListsOwnedBy } from './select-all-lists-owned-by';
import { getNonEmptyUserLists } from './get-non-empty-user-lists';
import { listsStatus } from './lists-status';
import { selectAllListsContainingExpression } from './select-all-lists-containing-expression';

export const lists = {
  queries: {
    getNonEmptyUserLists,
    listsStatus,
    lookupList,
    selectAllListsContainingExpression,
    selectAllListsOwnedBy,
    selectListContainingArticle,
  },
  initialState,
  handleEvent,
};
