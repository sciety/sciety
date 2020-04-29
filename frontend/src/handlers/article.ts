import { SERVICE_UNAVAILABLE } from 'http-status-codes';
import { Middleware, RouterContext } from '@koa/router';
import { NotFound } from 'http-errors';
import { Next } from 'koa';
import { FetchDatasetError } from '../api/fetch-dataset';
import { FetchReviewedArticle } from '../api/fetch-reviewed-article';
import Doi from '../data/doi';
import createLogger from '../logger';
import templateArticlePage from '../templates/article-page';
import templatePage from '../templates/page';
import { ReviewedArticle } from '../types/reviewed-article';

const log = createLogger('handler:article');

export default (fetchReviewedArticle: FetchReviewedArticle): Middleware => (
  async ({ response, params }: RouterContext, next: Next): Promise<void> => {
    let doi: Doi;

    try {
      doi = new Doi(params.doi);
    } catch (error) {
      log(`Article ${params.doi} not found: (${error})`);
      throw new NotFound(`${params.doi} not found`);
    }

    let reviewedArticle: ReviewedArticle;
    try {
      reviewedArticle = await fetchReviewedArticle(doi);
    } catch (e) {
      if (e instanceof FetchDatasetError) {
        log(`Failed to load article ${doi}: (${e})`);
        response.status = SERVICE_UNAVAILABLE;
        response.body = 'Article temporarily unavailable. Please try refreshing.';
        return;
      }
      log(`Article ${doi} not found: (${e})`);
      throw new NotFound(`${doi} not found`);
    }

    const page = templatePage(templateArticlePage(reviewedArticle));

    response.type = 'html';
    response.body = page;

    await next();
  }
);
