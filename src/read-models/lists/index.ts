import { handleEvent, initialState } from './handle-event.js';
import { lookupList } from './lookup-list.js';
import { selectListContainingArticle } from './select-list-containing-article.js';
import { selectAllListsOwnedBy } from './select-all-lists-owned-by.js';
import { getNonEmptyUserLists } from './get-non-empty-user-lists.js';
import { selectAllListsContainingArticle } from './select-all-lists-containing-article.js';
import { listsStatus } from './lists-status.js';

export const lists = {
  queries: {
    getNonEmptyUserLists,
    listsStatus,
    lookupList,
    selectAllListsContainingArticle,
    selectAllListsOwnedBy,
    selectListContainingArticle,
  },
  initialState,
  handleEvent,
};
