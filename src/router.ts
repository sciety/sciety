import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import convertArticleAndReviewsToArticlePage from './article-page/convert-article-and-reviews-to-article-page';
import fetchReviewsForArticlePage from './article-page/fetch-reviews-for-article-page';
import createEditorialCommunityPage from './editorial-community-page';
import ping from './handlers/ping';
import reviews from './handlers/reviews';
import createHomePage from './home-page';
import addPageTemplate from './middleware/add-page-template';
import fetchArticleForArticlePage from './middleware/fetch-article-for-article-page';
import renderArticlePage from './middleware/render-article-page';
import validateBiorxivDoi from './middleware/validate-biorxiv-doi';
import validateDoiParam from './middleware/validate-doi-param';
import { Adapters } from './types/adapters';

export default (adapters: Adapters): Router => {
  const router = new Router();

  router.get('/ping',
    ping());

  router.get('/',
    createHomePage(adapters),
    addPageTemplate());

  router.get('/articles/:doi(.+)',
    validateDoiParam(),
    validateBiorxivDoi(),
    fetchArticleForArticlePage(adapters.fetchArticle),
    fetchReviewsForArticlePage(adapters.reviewReferenceRepository, adapters.fetchReview),
    convertArticleAndReviewsToArticlePage(adapters.editorialCommunities),
    renderArticlePage(adapters.editorialCommunities),
    addPageTemplate());

  router.get('/editorial-communities/:id',
    createEditorialCommunityPage(adapters),
    addPageTemplate());

  router.post('/reviews',
    bodyParser({ enableTypes: ['form'] }),
    reviews(adapters.reviewReferenceRepository, adapters.editorialCommunities));

  return router;
};
