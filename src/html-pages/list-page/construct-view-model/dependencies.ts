import { Queries } from '../../../read-models/index.js';
import {
  FetchArticle,
  FetchRelatedArticles,
  FetchReview,
  FindVersionsForArticleDoi,
  Logger,
} from '../../../shared-ports/index.js';

export type Dependencies = Queries & {
  fetchArticle: FetchArticle,
  fetchRelatedArticles: FetchRelatedArticles,
  fetchReview: FetchReview,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  logger: Logger,
};
