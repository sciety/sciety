import { handleEvent, initialState } from './handle-event.js';
import { lookupList } from './lookup-list.js';
import { selectAllListsOwnedBy } from './select-all-lists-owned-by.js';
import { getNonEmptyUserLists } from './get-non-empty-user-lists.js';
import { listsStatus } from './lists-status.js';
import { selectAllListsContainingExpression } from './select-all-lists-containing-expression.js';
import { selectListContainingExpression } from './select-list-containing-expression.js';

export const lists = {
  queries: {
    getNonEmptyUserLists,
    listsStatus,
    lookupList,
    selectAllListsContainingExpression,
    selectAllListsOwnedBy,
    selectListContainingExpression,
  },
  initialState,
  handleEvent,
};
export {
  byUpdatedAt, eqList, List, toExpressionDoisByMostRecentlyAdded,
} from './list.js';
