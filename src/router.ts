import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { FetchAllArticleTeasers } from './api/fetch-all-article-teasers';
import createFetchCommunityArticles from './api/fetch-community-articles';
import { FetchReviewedArticle } from './api/fetch-reviewed-article';
import article from './handlers/article';
import community from './handlers/community';
import index from './handlers/index';
import ping from './handlers/ping';
import reviews from './handlers/reviews';
import { Community } from './types/community';
import ReviewReferenceRepository from './types/review-reference-repository';

export type RouterServices = {
  fetchAllArticleTeasers: FetchAllArticleTeasers;
  fetchReviewedArticle: FetchReviewedArticle;
  reviewReferenceRepository: ReviewReferenceRepository;
};

export default (services: RouterServices): Router => {
  const router = new Router();

  const eLifeCommunity: Community = {
    id: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
    name: 'eLife',
    description: `eLife is a non-profit organisation created by funders and led by researchers.
Our mission is to accelerate discovery by operating a platform for research communication that
encourages and recognises the most responsible behaviours in science.`,
  };

  router.get('/ping', ping());
  router.get('/', index(services.fetchAllArticleTeasers));
  router.get('/articles/:doi(.+)', article(services.fetchReviewedArticle));
  router.get('/communities/:id', community(eLifeCommunity, createFetchCommunityArticles()));
  router.post('/reviews', bodyParser({ enableTypes: ['form'] }), reviews(services.reviewReferenceRepository));

  return router;
};
