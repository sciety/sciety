import { getList } from './get-list';
import { ReadModel } from './handle-event';
import { selectListContainingArticle } from './select-list-containing-article';
import { selectAllListsOwnedBy } from './select-all-lists-owned-by';
import {
  GetList, SelectListContainingArticle, SelectAllListsOwnedBy,
} from '../../shared-ports';

export type Queries = {
  selectListContainingArticle: SelectListContainingArticle,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
  getList: GetList,
};

export const queries = (instance: ReadModel): Queries => ({
  selectListContainingArticle: selectListContainingArticle(instance),
  selectAllListsOwnedBy: selectAllListsOwnedBy(instance),
  getList: getList(instance),
});
