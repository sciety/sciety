import { lookupList } from './lookup-list';
import { ReadModel } from './handle-event';
import { selectListContainingArticle } from './select-list-containing-article';
import { selectAllListsOwnedBy } from './select-all-lists-owned-by';
import {
  LookupList, SelectListContainingArticle, SelectAllListsOwnedBy,
} from '../../shared-ports';

export type Queries = {
  selectListContainingArticle: SelectListContainingArticle,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
  lookupList: LookupList,
};

export const queries = (instance: ReadModel): Queries => ({
  selectListContainingArticle: selectListContainingArticle(instance),
  selectAllListsOwnedBy: selectAllListsOwnedBy(instance),
  lookupList: lookupList(instance),
});
