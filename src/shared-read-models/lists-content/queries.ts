import { ReadModel } from './handle-event';
import { isArticleOnTheListOwnedBy } from './is-article-on-the-list-owned-by';
import { selectAllListsOwnedBy } from './select-all-lists-owned-by';
import { selectArticlesBelongingToList } from './select-articles-belonging-to-list';
import { IsArticleOnTheListOwnedBy, SelectAllListsOwnedBy, SelectArticlesBelongingToList } from '../../shared-ports';

export type Queries = {
  isArticleOnTheListOwnedBy: IsArticleOnTheListOwnedBy,
  selectArticlesBelongingToList: SelectArticlesBelongingToList,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

export const queries = (instance: ReadModel): Queries => ({
  isArticleOnTheListOwnedBy: isArticleOnTheListOwnedBy(instance),
  selectArticlesBelongingToList: selectArticlesBelongingToList(instance),
  selectAllListsOwnedBy: selectAllListsOwnedBy(instance),
});
