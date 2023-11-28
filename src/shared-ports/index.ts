import { SearchForArticles } from './search-for-articles';
import { AddArticleToList } from './add-article-to-list';
import { CommitEvents } from './commit-events';
import { CreateList } from './create-list';
import { EditListDetails } from './edit-list-details';
import { FetchArticle } from './fetch-article';
import { FetchReview } from './fetch-review';
import { FetchStaticFile } from './fetch-static-file';
import { GetAllEvents } from './get-all-events';
import { GetArticleSubjectArea } from './get-article-subject-area';
import { Logger } from './logger';
import { RecordSubjectArea } from './record-subject-area';
import { RemoveArticleFromList } from './remove-article-from-list';
import { FindVersionsForArticleDoi } from './find-versions-for-article-doi';
import { FetchRelatedArticles } from './fetch-related-articles';
import { FetchPaperExpression } from './fetch-paper-expression';

export { GetAllEvents } from './get-all-events';
export { CommitEvents } from './commit-events';
export { EditListDetails } from './edit-list-details';
export { Logger } from './logger';
export { AddArticleToList } from './add-article-to-list';
export { CreateList } from './create-list';
export { FetchArticle } from './fetch-article';
export { FetchReview } from './fetch-review';
export { FetchStaticFile } from './fetch-static-file';
export { GetArticleSubjectArea } from './get-article-subject-area';
export { RecordSubjectArea } from './record-subject-area';
export { SearchForArticles } from './search-for-articles';
export { FindVersionsForArticleDoi } from './find-versions-for-article-doi';
export { FetchRelatedArticles } from './fetch-related-articles';

export type SharedPorts = {
  addArticleToList: AddArticleToList,
  commitEvents: CommitEvents,
  createList: CreateList,
  editListDetails: EditListDetails,
  fetchArticle: FetchArticle,
  fetchPaperExpression: FetchPaperExpression,
  fetchRelatedArticles: FetchRelatedArticles,
  fetchReview: FetchReview,
  fetchStaticFile: FetchStaticFile,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getAllEvents: GetAllEvents,
  getArticleSubjectArea: GetArticleSubjectArea,
  logger: Logger,
  recordSubjectArea: RecordSubjectArea,
  removeArticleFromList: RemoveArticleFromList,
  searchForArticles: SearchForArticles,
};
