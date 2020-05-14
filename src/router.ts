import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import convertArticleAndReviewsToArticlePage from './article-page/convert-article-and-reviews-to-article-page';
import fetchReviewsForArticlePage from './article-page/fetch-reviews-for-article-page';
import lookupEditorialCommunity from './editorial-community-page/lookup-editorial-community';
import lookupReviewedArticles from './editorial-community-page/lookup-reviewed-articles';
import renderEditorialCommunityPage from './editorial-community-page/render-editorial-community-page';
import ping from './handlers/ping';
import reviews from './handlers/reviews';
import renderHomePage from './home-page/render-home-page';
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
    renderHomePage(adapters.editorialCommunities),
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
    lookupEditorialCommunity(adapters.editorialCommunities),
    lookupReviewedArticles(adapters.reviewReferenceRepository),
    renderEditorialCommunityPage(adapters.fetchEditorialCommunityReviewedArticles),
    addPageTemplate());

  router.post('/reviews',
    bodyParser({ enableTypes: ['form'] }),
    reviews(adapters.reviewReferenceRepository, adapters.editorialCommunities));

  return router;
};
