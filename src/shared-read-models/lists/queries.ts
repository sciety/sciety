import { getList } from './get-list';
import { ReadModel } from './handle-event';
import { isArticleOnTheListOwnedBy } from './is-article-on-the-list-owned-by';
import { selectAllListsOwnedBy } from './select-all-lists-owned-by';
import {
  GetList, IsArticleOnTheListOwnedBy, SelectAllListsOwnedBy,
} from '../../shared-ports';

type Queries = {
  isArticleOnTheListOwnedBy: IsArticleOnTheListOwnedBy,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
  getList: GetList,
};

export const queries = (instance: ReadModel): Queries => ({
  isArticleOnTheListOwnedBy: isArticleOnTheListOwnedBy(instance),
  selectAllListsOwnedBy: selectAllListsOwnedBy(instance),
  getList: getList(instance),
});
