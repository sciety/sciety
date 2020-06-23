import { Middleware } from '@koa/router';
import createFetchReviews from './fetch-reviews';
import renderArticlePage from './middleware/render-article-page';
import { Adapters } from '../types/adapters';

export default (adapters: Adapters): Middleware => {
  const fetchReviews = createFetchReviews(
    adapters.reviewReferenceRepository,
    adapters.fetchReview,
    adapters.editorialCommunities,
  );
  return renderArticlePage(
    adapters.editorialCommunities,
    adapters.getBiorxivCommentCount,
    adapters.fetchArticle,
    fetchReviews,
    adapters.reviewReferenceRepository,
  );
};
