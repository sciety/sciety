import { Middleware } from '@koa/router';
import compose from 'koa-compose';
import convertArticleAndReviewsToArticlePage from './middleware/convert-article-and-reviews-to-article-page';
import fetchArticleForArticlePage from './middleware/fetch-article-for-article-page';
import fetchReviewsForArticlePage from './middleware/fetch-reviews-for-article-page';
import renderArticlePage from './middleware/render-article-page';
import validateBiorxivDoi from './middleware/validate-biorxiv-doi';
import validateDoiParam from './middleware/validate-doi-param';
import { GetCommentCount } from './render-page-header';
import { Adapters } from '../types/adapters';

const getCommentCount: GetCommentCount = async (doi) => {
  if (doi.value === '10.1101/2020.05.11.089896') {
    return 11;
  }
  return 0;
};

export default (adapters: Adapters): Middleware => (
  compose([
    validateDoiParam(),
    validateBiorxivDoi(),
    fetchArticleForArticlePage(adapters.fetchArticle),
    fetchReviewsForArticlePage(adapters.reviewReferenceRepository, adapters.fetchReview),
    convertArticleAndReviewsToArticlePage(adapters.editorialCommunities),
    renderArticlePage(adapters.editorialCommunities, getCommentCount),
  ])
);
