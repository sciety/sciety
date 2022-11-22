import { AddArticleToList } from './add-article-to-list';
import { CommitEvents } from './commit-events';
import { CreateList } from './create-list';
import { FetchArticle } from './fetch-article';
import { GetAllEvents } from './get-all-events';
import { GetArticleSubjectArea } from './get-article-subject-area';
import { GetListsOwnedBy } from './get-lists-owned-by';
import { IsArticleOnTheListOwnedBy } from './is-article-on-the-list-owned-by';
import { Logger } from './logger';
import { RecordSubjectArea } from './record-subject-area';
import { RemoveArticleFromList } from './remove-article-from-list';
import { SelectAllListsOwnedBy } from './select-all-lists-owned-by';
import { SelectArticlesBelongingToList } from './select-articles-belonging-to-list';

export { GetAllEvents } from './get-all-events';
export { CommitEvents } from './commit-events';
export { Logger } from './logger';
export { AddArticleToList } from './add-article-to-list';
export { CreateList } from './create-list';
export { FetchArticle } from './fetch-article';
export { GetListsOwnedBy } from './get-lists-owned-by';
export { RemoveArticleFromList } from './remove-article-from-list';
export { GetArticleSubjectArea } from './get-article-subject-area';
export { RecordSubjectArea } from './record-subject-area';
export { GetArticleIdsByState } from './get-article-ids-by-state';
export { SelectArticlesBelongingToList } from './select-articles-belonging-to-list';
export { IsArticleOnTheListOwnedBy } from './is-article-on-the-list-owned-by';
export { SelectAllListsOwnedBy } from './select-all-lists-owned-by';
export { GetOneArticleReadyToBeListed, ArticleWithSubjectArea } from './get-one-article-ready-to-be-listed';
export { GetOneArticleIdInEvaluatedState } from './get-one-article-id-in-evaluated-state';

export type SharedPorts = {
  selectArticlesBelongingToList: SelectArticlesBelongingToList,
  isArticleOnTheListOwnedBy: IsArticleOnTheListOwnedBy,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
  addArticleToList: AddArticleToList,
  commitEvents: CommitEvents,
  createList: CreateList,
  fetchArticle: FetchArticle,
  getAllEvents: GetAllEvents,
  getArticleSubjectArea: GetArticleSubjectArea,
  getListsOwnedBy: GetListsOwnedBy,
  recordSubjectArea: RecordSubjectArea,
  logger: Logger,
  removeArticleFromList: RemoveArticleFromList,
};
