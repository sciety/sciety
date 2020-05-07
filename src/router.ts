import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { FetchArticle } from './api/fetch-article';
import { FetchCommunityArticles } from './api/fetch-community-articles';
import { FetchReview } from './api/fetch-review';
import communities from './data/communities';
import community from './handlers/community';
import index from './handlers/index';
import ping from './handlers/ping';
import reviews from './handlers/reviews';
import addPageTemplate from './middleware/add-page-template';
import convertArticleAndReviewsToArticlePage from './middleware/convert-article-and-reviews-to-article-page';
import fetchArticleForArticlePage from './middleware/fetch-article-for-article-page';
import fetchReviewsForArticlePage from './middleware/fetch-reviews-for-article-page';
import initializePrcContext from './middleware/initialize-prc-context';
import renderArticlePage from './middleware/render-article-page';
import validateBiorxivDoi from './middleware/validate-biorxiv-doi';
import validateDoiParam from './middleware/validate-doi-param';
import ReviewReferenceRepository from './types/review-reference-repository';

export type RouterServices = {
  fetchArticle: FetchArticle;
  fetchCommunityArticles: FetchCommunityArticles;
  fetchReview: FetchReview;
  reviewReferenceRepository: ReviewReferenceRepository;
};

export default (services: RouterServices): Router => {
  const router = new Router();

  router.get('/ping',
    initializePrcContext(),
    ping());

  router.get('/',
    initializePrcContext(),
    addPageTemplate(),
    index());

  router.get('/articles/:doi(.+)',
    initializePrcContext(),
    validateDoiParam(),
    validateBiorxivDoi(),
    fetchArticleForArticlePage(services.fetchArticle),
    fetchReviewsForArticlePage(services.reviewReferenceRepository, services.fetchReview),
    convertArticleAndReviewsToArticlePage(),
    renderArticlePage(),
    addPageTemplate());

  router.get('/communities/:id',
    initializePrcContext(),
    addPageTemplate(),
    community(communities, services.fetchCommunityArticles));

  router.post('/reviews',
    initializePrcContext(),
    bodyParser({ enableTypes: ['form'] }),
    reviews(services.reviewReferenceRepository));

  return router;
};
