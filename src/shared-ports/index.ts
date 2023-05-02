import { SelectAllListsContainingArticle } from './select-all-lists-containing-article';
import { SearchForArticles } from './search-for-articles';
import { AddArticleToList } from './add-article-to-list';
import { CommitEvents } from './commit-events';
import { CreateList } from './create-list';
import { EditListDetails } from './edit-list-details';
import { FetchArticle } from './fetch-article';
import { FetchReview } from './fetch-review';
import { FetchStaticFile } from './fetch-static-file';
import { GetAllEvents } from './get-all-events';
import { GetArticleIdsByState } from './get-article-ids-by-state';
import { GetArticleSubjectArea } from './get-article-subject-area';
import { GetEvaluatedArticlesListIdForGroup } from './get-evaluated-articles-list-id-for-group';
import { GetFollowers } from './get-followers';
import { GetGroup } from './get-group';
import { GetGroupBySlug } from './get-group-by-slug';
import { GetGroupsFollowedBy } from './get-groups-followed-by';
import { LookupList } from './lookup-list';
import { GetOneArticleIdInEvaluatedState } from './get-one-article-id-in-evaluated-state';
import { GetOneArticleReadyToBeListed } from './get-one-article-ready-to-be-listed';
import { LookupUser } from './lookup-user';
import { LookupUserByHandle } from './lookup-user-by-handle';
import { SelectListContainingArticle } from './select-list-containing-article';
import { IsFollowing } from './is-following';
import { Logger } from './logger';
import { RecordSubjectArea } from './record-subject-area';
import { RemoveArticleFromList } from './remove-article-from-list';
import { SelectAllListsOwnedBy } from './select-all-lists-owned-by';
import { GetNonEmptyUserLists } from './get-non-empty-user-lists';
import { GetActivityForDoi } from './get-activity-for-doi';
import { FindVersionsForArticleDoi } from './find-versions-for-article-doi';

export { GetAllEvents } from './get-all-events';
export { CommitEvents } from './commit-events';
export { EditListDetails } from './edit-list-details';
export { Logger } from './logger';
export { AddArticleToList } from './add-article-to-list';
export { CreateList } from './create-list';
export { FetchArticle } from './fetch-article';
export { FetchReview } from './fetch-review';
export { FetchStaticFile } from './fetch-static-file';
export { GetGroup } from './get-group';
export { GetGroupBySlug } from './get-group-by-slug';
export { LookupList } from './lookup-list';
export { LookupUser } from './lookup-user';
export { LookupUserByHandle } from './lookup-user-by-handle';
export { GetArticleSubjectArea } from './get-article-subject-area';
export { RecordSubjectArea } from './record-subject-area';
export { GetArticleIdsByState, ArticleIdsByState } from './get-article-ids-by-state';
export { SelectListContainingArticle } from './select-list-containing-article';
export { SelectAllListsOwnedBy } from './select-all-lists-owned-by';
export { GetOneArticleReadyToBeListed, ArticleWithSubjectArea } from './get-one-article-ready-to-be-listed';
export { GetOneArticleIdInEvaluatedState } from './get-one-article-id-in-evaluated-state';
export { GetEvaluatedArticlesListIdForGroup } from './get-evaluated-articles-list-id-for-group';
export { SearchForArticles } from './search-for-articles';
export { GetFollowers } from './get-followers';
export { GetGroupsFollowedBy } from './get-groups-followed-by';
export { IsFollowing } from './is-following';
export { GetActivityForDoi } from './get-activity-for-doi';
export { FindVersionsForArticleDoi } from './find-versions-for-article-doi';
export { GetNonEmptyUserLists } from './get-non-empty-user-lists';
export { SelectAllListsContainingArticle } from './select-all-lists-containing-article';

export type SharedPorts = {
  addArticleToList: AddArticleToList,
  commitEvents: CommitEvents,
  createList: CreateList,
  editListDetails: EditListDetails,
  fetchArticle: FetchArticle,
  fetchReview: FetchReview,
  fetchStaticFile: FetchStaticFile,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getAllEvents: GetAllEvents,
  getArticleIdsByState: GetArticleIdsByState,
  getArticleSubjectArea: GetArticleSubjectArea,
  getFollowers: GetFollowers,
  getGroup: GetGroup,
  getGroupBySlug: GetGroupBySlug,
  getGroupsFollowedBy: GetGroupsFollowedBy,
  lookupList: LookupList,
  lookupUser: LookupUser,
  lookupUserByHandle: LookupUserByHandle,
  getOneArticleIdInEvaluatedState: GetOneArticleIdInEvaluatedState,
  getOneArticleReadyToBeListed: GetOneArticleReadyToBeListed,
  selectListContainingArticle: SelectListContainingArticle,
  isFollowing: IsFollowing,
  logger: Logger,
  recordSubjectArea: RecordSubjectArea,
  removeArticleFromList: RemoveArticleFromList,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
  selectAllListsContainingArticle: SelectAllListsContainingArticle,
  getNonEmptyUserLists: GetNonEmptyUserLists,
  getEvaluatedArticlesListIdForGroup: GetEvaluatedArticlesListIdForGroup,
  searchForArticles: SearchForArticles,
  getActivityForDoi: GetActivityForDoi,
};
