import { lookupList } from './lookup-list';
import { ReadModel } from './handle-event';
import { selectListContainingArticle } from './select-list-containing-article';
import { selectAllListsOwnedBy } from './select-all-lists-owned-by';
import {
  GetNonEmptyUserLists,
  LookupList, SelectListContainingArticle, SelectAllListsOwnedBy,
} from '../../shared-ports';
import { getNonEmptyUserLists } from './get-non-empty-user-lists';

export type Queries = {
  selectListContainingArticle: SelectListContainingArticle,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
  lookupList: LookupList,
  getNonEmptyUserLists: GetNonEmptyUserLists,
};

export const queries = (instance: ReadModel): Queries => ({
  selectListContainingArticle: selectListContainingArticle(instance),
  selectAllListsOwnedBy: selectAllListsOwnedBy(instance),
  lookupList: lookupList(instance),
  getNonEmptyUserLists: getNonEmptyUserLists(instance),
});
