import { Middleware, RouterContext } from '@koa/router';
import { NotFound } from 'http-errors';
import { Next } from 'koa';
import { FetchCrossrefArticle } from '../../api/fetch-crossref-article';
import Doi from '../../data/doi';
import createLogger from '../../logger';

const log = createLogger('middleware:fetch-article-for-article-page');

export default (fetchArticle: FetchCrossrefArticle): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    const doi: Doi = ctx.state.articleDoi;

    ctx.state.article = fetchArticle(doi)
      .catch((error) => {
        log(`Failed to load article ${doi}: (${error})`);

        throw new NotFound(`${doi} not found`);
      });

    await next();
  }
);
