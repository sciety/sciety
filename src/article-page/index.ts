import { Middleware } from '@koa/router';
import compose from 'koa-compose';
import createFetchReviews from './fetch-reviews';
import renderArticlePage from './middleware/render-article-page';
import validateBiorxivDoi from './middleware/validate-biorxiv-doi';
import validateDoiParam from './middleware/validate-doi-param';
import { Adapters } from '../types/adapters';

export default (adapters: Adapters): Middleware => {
  const fetchReviews = createFetchReviews(
    adapters.reviewReferenceRepository,
    adapters.fetchReview,
    adapters.editorialCommunities,
  );
  return compose([
    validateDoiParam(),
    validateBiorxivDoi(),
    renderArticlePage(
      adapters.editorialCommunities,
      adapters.getBiorxivCommentCount,
      adapters.fetchArticle,
      fetchReviews,
      adapters.reviewReferenceRepository,
    ),
  ]);
};
