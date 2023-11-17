import { Queries } from '../../read-models';
import { Ports as GetLatestArticleVersionDatePorts } from './get-latest-article-version-date';
import {
  FetchArticle, FetchRelatedArticles, FetchReview, FindVersionsForArticleDoi, Logger,
} from '../../shared-ports';
import { ConstructReviewingGroupsDependencies } from '../reviewing-groups';

export type Dependencies = Queries
& ConstructReviewingGroupsDependencies
& GetLatestArticleVersionDatePorts
& {
  fetchArticle: FetchArticle,
  fetchRelatedArticles: FetchRelatedArticles,
  fetchReview: FetchReview,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  logger: Logger,
};
