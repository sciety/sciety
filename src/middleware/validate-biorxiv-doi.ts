import { Middleware, RouterContext } from '@koa/router';
import { NotFound } from 'http-errors';
import { Next } from 'koa';
import createLogger from '../logger';

const log = createLogger('middleware:validate-biorxiv-doi');

const biorxivPrefix = '10.1101';

export default (): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    const { articleDoi } = ctx.state;

    if (!(articleDoi.hasPrefix(biorxivPrefix))) {
      log(`Article ${articleDoi} is not from bioRxiv`);
      throw new NotFound('Not a bioRxiv DOI.');
    }

    await next();
  }
);
