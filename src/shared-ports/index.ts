import { AddArticleToList } from './add-article-to-list';
import { CommitEvents } from './commit-events';
import { CreateList } from './create-list';
import { EditListDetails } from './edit-list-details';
import { FetchArticle } from './fetch-article';
import { GetAllEvents } from './get-all-events';
import { GetAllGroups } from './get-all-groups';
import { GetArticleIdsByState } from './get-article-ids-by-state';
import { GetArticleSubjectArea } from './get-article-subject-area';
import { GetEvaluatedArticlesListIdForGroup } from './get-evaluated-articles-list-id-for-group';
import { GetGroup } from './get-group';
import { GetGroupBySlug } from './get-group-by-slug';
import { GetList } from './get-list';
import { GetOneArticleIdInEvaluatedState } from './get-one-article-id-in-evaluated-state';
import { GetOneArticleReadyToBeListed } from './get-one-article-ready-to-be-listed';
import { GetUser } from './get-user';
import { GetUserViaHandle } from './get-user-via-handle';
import { IsArticleOnTheListOwnedBy } from './is-article-on-the-list-owned-by';
import { Logger } from './logger';
import { RecordSubjectArea } from './record-subject-area';
import { RemoveArticleFromList } from './remove-article-from-list';
import { SelectAllListsOwnedBy } from './select-all-lists-owned-by';

export { GetAllEvents } from './get-all-events';
export { CommitEvents } from './commit-events';
export { EditListDetails } from './edit-list-details';
export { Logger } from './logger';
export { AddArticleToList } from './add-article-to-list';
export { CreateList } from './create-list';
export { FetchArticle } from './fetch-article';
export { GetGroup } from './get-group';
export { GetGroupBySlug } from './get-group-by-slug';
export { GetAllGroups } from './get-all-groups';
export { GetList } from './get-list';
export { GetUser } from './get-user';
export { GetUserViaHandle } from './get-user-via-handle';
// ts-unused-exports:disable-next-line
export { RemoveArticleFromList } from './remove-article-from-list';
export { GetArticleSubjectArea } from './get-article-subject-area';
export { RecordSubjectArea } from './record-subject-area';
export { GetArticleIdsByState, ArticleIdsByState } from './get-article-ids-by-state';
export { IsArticleOnTheListOwnedBy } from './is-article-on-the-list-owned-by';
export { SelectAllListsOwnedBy } from './select-all-lists-owned-by';
export { GetOneArticleReadyToBeListed, ArticleWithSubjectArea } from './get-one-article-ready-to-be-listed';
export { GetOneArticleIdInEvaluatedState } from './get-one-article-id-in-evaluated-state';
// ts-unused-exports:disable-next-line
export { GetEvaluatedArticlesListIdForGroup } from './get-evaluated-articles-list-id-for-group';

export type SharedPorts = {
  addArticleToList: AddArticleToList,
  commitEvents: CommitEvents,
  createList: CreateList,
  editListDetails: EditListDetails,
  fetchArticle: FetchArticle,
  getAllEvents: GetAllEvents,
  getAllGroups: GetAllGroups,
  getArticleIdsByState: GetArticleIdsByState,
  getArticleSubjectArea: GetArticleSubjectArea,
  getGroup: GetGroup,
  getGroupBySlug: GetGroupBySlug,
  getList: GetList,
  getUser: GetUser,
  getUserViaHandle: GetUserViaHandle,
  getOneArticleIdInEvaluatedState: GetOneArticleIdInEvaluatedState,
  getOneArticleReadyToBeListed: GetOneArticleReadyToBeListed,
  isArticleOnTheListOwnedBy: IsArticleOnTheListOwnedBy,
  logger: Logger,
  recordSubjectArea: RecordSubjectArea,
  removeArticleFromList: RemoveArticleFromList,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
  getEvaluatedArticlesListIdForGroup: GetEvaluatedArticlesListIdForGroup,
};
