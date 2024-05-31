import { deprecatedSelectAllListsPromotedByGroup } from './deprecated-select-all-lists-promoted-by-group';
import { getNonEmptyUserLists } from './get-non-empty-user-lists';
import { handleEvent, initialState } from './handle-event';
import { listsStatus } from './lists-status';
import { lookupHardcodedListImage } from './lookup-hardcoded-list-image';
import { lookupList } from './lookup-list';
import { selectAllListsContainingExpression } from './select-all-lists-containing-expression';
import { selectAllListsOwnedBy } from './select-all-lists-owned-by';
import { selectListContainingExpression } from './select-list-containing-expression';

export const lists = {
  queries: {
    getNonEmptyUserLists,
    listsStatus,
    lookupList,
    lookupHardcodedListImage,
    selectAllListsContainingExpression,
    selectAllListsPromotedByGroup: deprecatedSelectAllListsPromotedByGroup,
    selectAllListsOwnedBy,
    selectListContainingExpression,
  },
  initialState,
  handleEvent,
};

export {
  byUpdatedAt, eqList, List, toExpressionDoisByMostRecentlyAdded,
} from './list';
