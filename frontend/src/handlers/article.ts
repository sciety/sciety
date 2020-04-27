import { Middleware, RouterContext } from '@koa/router';
import { InternalServerError, NotFound } from 'http-errors';
import { Next } from 'koa';
import { FetchReviewedArticle } from '../api/fetch-reviewed-article';
import createLogger from '../logger';
import templateArticlePage from '../templates/article-page';
import templatePage from '../templates/page';
import { ReviewedArticle } from '../types/reviewed-article';

const log = createLogger('handler:article');

export default (fetchReviewedArticle: FetchReviewedArticle): Middleware => (
  async ({ response, params: { id } }: RouterContext, next: Next): Promise<void> => {
    if (typeof id === 'undefined') {
      log('DOI `id` parameter not present');
      throw new InternalServerError('DOI `id` parameter not present');
    }
    const doi = decodeURIComponent(id);

    let reviewedArticle: ReviewedArticle;
    try {
      reviewedArticle = await fetchReviewedArticle(doi);
    } catch (e) {
      log(`Article ${doi} not found: ${e}`);
      throw new NotFound(`${doi} not found`);
    }

    const page = templatePage(templateArticlePage(reviewedArticle));

    response.type = 'html';
    response.body = page;

    await next();
  }
);
