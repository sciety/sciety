import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { FetchCommunityArticles } from './api/fetch-community-articles';
import { FetchReviewedArticle } from './api/fetch-reviewed-article';
import communities from './data/communities';
import Doi from './data/doi';
import article from './handlers/article';
import community from './handlers/community';
import index from './handlers/index';
import ping from './handlers/ping';
import reviews from './handlers/reviews';
import addPageTemplate from './middleware/add-page-template';
import validateDoiParam from './middleware/validate-doi-param';
import ReviewReferenceRepository from './types/review-reference-repository';

export type RouterServices = {
  fetchCommunityArticles: FetchCommunityArticles;
  fetchReviewedArticle: FetchReviewedArticle;
  reviewReferenceRepository: ReviewReferenceRepository;
};

declare module 'koa' {
  interface BaseContext {
    articleDoi: Doi;
  }
}

export default (services: RouterServices): Router => {
  const router = new Router();

  router.get('/ping',
    ping());

  router.get('/',
    addPageTemplate(),
    index());

  router.get('/articles/:doi(.+)',
    validateDoiParam(),
    addPageTemplate(),
    article(services.fetchReviewedArticle));

  router.get('/communities/:id',
    addPageTemplate(),
    community(communities, services.fetchCommunityArticles));

  router.post('/reviews',
    bodyParser({ enableTypes: ['form'] }),
    reviews(services.reviewReferenceRepository));

  return router;
};
