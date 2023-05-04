import { LookupList, lookupList } from './lookup-list';
import { ReadModel } from './handle-event';
import { selectListContainingArticle } from './select-list-containing-article';
import { selectAllListsOwnedBy } from './select-all-lists-owned-by';
import {
  GetNonEmptyUserLists,
  SelectListContainingArticle, SelectAllListsOwnedBy,
  SelectAllListsContainingArticle,
} from '../../shared-ports';
import { getNonEmptyUserLists } from './get-non-empty-user-lists';
import { selectAllListsContainingArticle } from './select-all-lists-containing-article';

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
