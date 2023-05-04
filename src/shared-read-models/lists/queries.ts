import { LookupList, lookupList } from './lookup-list';
import { ReadModel } from './handle-event';
import { SelectListContainingArticle, selectListContainingArticle } from './select-list-containing-article';
import { SelectAllListsOwnedBy, selectAllListsOwnedBy } from './select-all-lists-owned-by';
import {
  GetNonEmptyUserLists,
} from '../../shared-ports';
import { getNonEmptyUserLists } from './get-non-empty-user-lists';
import { SelectAllListsContainingArticle, selectAllListsContainingArticle } from './select-all-lists-containing-article';

export type Queries = {
  selectListContainingArticle: SelectListContainingArticle,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
  selectAllListsContainingArticle: SelectAllListsContainingArticle,
  lookupList: LookupList,
  getNonEmptyUserLists: GetNonEmptyUserLists,
};

export const queries = (instance: ReadModel): Queries => ({
  selectListContainingArticle: selectListContainingArticle(instance),
  selectAllListsOwnedBy: selectAllListsOwnedBy(instance),
  selectAllListsContainingArticle: selectAllListsContainingArticle(instance),
  lookupList: lookupList(instance),
  getNonEmptyUserLists: getNonEmptyUserLists(instance),
});
