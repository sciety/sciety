import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { FetchArticle } from './api/fetch-article';
import { FetchEditorialCommunityReviewedArticles } from './api/fetch-editorial-community-reviewed-articles';
import { FetchReview } from './api/fetch-review';
import convertArticleAndReviewsToArticlePage from './article-page/convert-article-and-reviews-to-article-page';
import fetchReviewsForArticlePage from './article-page/fetch-reviews-for-article-page';
import editorialCommunity from './handlers/editorial-community';
import ping from './handlers/ping';
import reviews from './handlers/reviews';
import renderHomePage from './home-page/render-home-page';
import addPageTemplate from './middleware/add-page-template';
import fetchArticleForArticlePage from './middleware/fetch-article-for-article-page';
import renderArticlePage from './middleware/render-article-page';
import validateBiorxivDoi from './middleware/validate-biorxiv-doi';
import validateDoiParam from './middleware/validate-doi-param';
import { EditorialCommunity } from './types/editorial-community';
import ReviewReferenceRepository from './types/review-reference-repository';

export type RouterServices = {
  fetchArticle: FetchArticle;
  fetchEditorialCommunityReviewedArticles: FetchEditorialCommunityReviewedArticles;
  fetchReview: FetchReview;
  editorialCommunities: Array<EditorialCommunity>;
  reviewReferenceRepository: ReviewReferenceRepository;
};

export default (services: RouterServices): Router => {
  const router = new Router();

  router.get('/ping',
    ping());

  router.get('/',
    renderHomePage(services.editorialCommunities),
    addPageTemplate());

  router.get('/articles/:doi(.+)',
    validateDoiParam(),
    validateBiorxivDoi(),
    fetchArticleForArticlePage(services.fetchArticle),
    fetchReviewsForArticlePage(services.reviewReferenceRepository, services.fetchReview),
    convertArticleAndReviewsToArticlePage(services.editorialCommunities),
    renderArticlePage(services.editorialCommunities),
    addPageTemplate());

  router.get('/editorial-communities/:id',
    editorialCommunity(services.editorialCommunities, services.fetchEditorialCommunityReviewedArticles),
    addPageTemplate());

  router.post('/reviews',
    bodyParser({ enableTypes: ['form'] }),
    reviews(services.reviewReferenceRepository, services.editorialCommunities));

  return router;
};
