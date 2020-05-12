import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { FetchArticle } from './api/fetch-article';
import { FetchEditorialCommunityReviewedArticles } from './api/fetch-editorial-community-reviewed-articles';
import { FetchReview } from './api/fetch-review';
import editorialCommunities from './data/editorial-communities';
import editorialCommunity from './handlers/editorial-community';
import index from './handlers/index';
import ping from './handlers/ping';
import reviews from './handlers/reviews';
import addPageTemplate from './middleware/add-page-template';
import convertArticleAndReviewsToArticlePage from './middleware/convert-article-and-reviews-to-article-page';
import fetchArticleForArticlePage from './middleware/fetch-article-for-article-page';
import fetchReviewsForArticlePage from './middleware/fetch-reviews-for-article-page';
import renderArticlePage from './middleware/render-article-page';
import validateBiorxivDoi from './middleware/validate-biorxiv-doi';
import validateDoiParam from './middleware/validate-doi-param';
import ReviewReferenceRepository from './types/review-reference-repository';

export type RouterServices = {
  fetchArticle: FetchArticle;
  fetchEditorialCommunityReviewedArticles: FetchEditorialCommunityReviewedArticles;
  fetchReview: FetchReview;
  reviewReferenceRepository: ReviewReferenceRepository;
};

export default (services: RouterServices): Router => {
  const router = new Router();

  router.get('/ping',
    ping());

  router.get('/',
    index(),
    addPageTemplate());

  router.get('/articles/:doi(.+)',
    validateDoiParam(),
    validateBiorxivDoi(),
    fetchArticleForArticlePage(services.fetchArticle),
    fetchReviewsForArticlePage(services.reviewReferenceRepository, services.fetchReview),
    convertArticleAndReviewsToArticlePage(),
    renderArticlePage(),
    addPageTemplate());

  router.get('/editorial-communities/:id',
    editorialCommunity(editorialCommunities, services.fetchEditorialCommunityReviewedArticles),
    addPageTemplate());

  router.post('/reviews',
    bodyParser({ enableTypes: ['form'] }),
    reviews(services.reviewReferenceRepository));

  return router;
};
