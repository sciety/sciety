import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { FetchAllArticleTeasers } from './api/fetch-all-article-teasers';
import { FetchReviewedArticle } from './api/fetch-reviewed-article';
import article from './handlers/article';
import index from './handlers/index';
import ping from './handlers/ping';
import reviews from './handlers/reviews';
import ReviewReferenceRepository from './types/review-reference-repository';

export type RouterServices = {
  fetchAllArticleTeasers: FetchAllArticleTeasers;
  fetchReviewedArticle: FetchReviewedArticle;
  reviewReferenceRepository: ReviewReferenceRepository;
};

export default (services: RouterServices): Router => {
  const router = new Router();

  router.get('/ping', ping());
  router.get('/', index(services.fetchAllArticleTeasers));
  router.get('/articles/:prefix/:suffix', article(services.fetchReviewedArticle));
  router.post('/reviews', bodyParser({ enableTypes: ['form'] }), reviews(services.reviewReferenceRepository));

  return router;
};
