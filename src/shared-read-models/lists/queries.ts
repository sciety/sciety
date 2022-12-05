import {
  GetList, IsArticleOnTheListOwnedBy, SelectAllListsOwnedBy,
} from '../../shared-ports';

export type Queries = {
  isArticleOnTheListOwnedBy: IsArticleOnTheListOwnedBy,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
  getList: GetList,
};
