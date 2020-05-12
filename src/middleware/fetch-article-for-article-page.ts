import { Middleware, RouterContext } from '@koa/router';
import { NotFound, ServiceUnavailable } from 'http-errors';
import { Next } from 'koa';
import { FetchArticle } from '../api/fetch-article';
import { FetchDatasetError } from '../api/fetch-dataset';
import Doi from '../data/doi';
import createLogger from '../logger';

const log = createLogger('middleware:fetch-article-for-article-page');

export default (fetchArticle: FetchArticle): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    const doi: Doi = ctx.state.articleDoi;

    ctx.state.article = fetchArticle(doi)
      .catch((error) => {
        log(`Failed to load article ${doi}: (${error})`);

        if (error instanceof FetchDatasetError) {
          throw new ServiceUnavailable('Article temporarily unavailable. Please try refreshing.');
        }

        throw new NotFound(`${doi} not found`);
      });

    await next();
  }
);
