import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { FetchAllArticleTeasers } from './api/fetch-all-article-teasers';
import { FetchCommunityArticles } from './api/fetch-community-articles';
import { FetchReviewedArticle } from './api/fetch-reviewed-article';
import communities from './data/communities';
import article from './handlers/article';
import community from './handlers/community';
import index from './handlers/index';
import ping from './handlers/ping';
import reviews from './handlers/reviews';
import ReviewReferenceRepository from './types/review-reference-repository';

export type RouterServices = {
  fetchAllArticleTeasers: FetchAllArticleTeasers;
  fetchCommunityArticles: FetchCommunityArticles;
  fetchReviewedArticle: FetchReviewedArticle;
  reviewReferenceRepository: ReviewReferenceRepository;
};

export default (services: RouterServices): Router => {
  const router = new Router();

  router.get('/ping', ping());
  router.get('/', index(services.fetchAllArticleTeasers));
  router.get('/articles/:doi(.+)', article(services.fetchReviewedArticle));
  router.get('/communities/:id', community(communities, services.fetchCommunityArticles));
  router.post('/reviews', bodyParser({ enableTypes: ['form'] }), reviews(services.reviewReferenceRepository));

  return router;
};
