import { Middleware, RouterContext } from '@koa/router';
import { NotFound } from 'http-errors';
import { Next } from 'koa';
import Doi from '../data/doi';
import createLogger from '../logger';

const log = createLogger('middleware:validate-doi-param');

export default (): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    try {
      ctx.prc.articleDoi = new Doi(ctx.params.doi || '');
    } catch (error) {
      log(`Article ${ctx.params.doi} not found: (${error})`);
      throw new NotFound(`${ctx.params.doi} not found`);
    }

    await next();
  }
);
