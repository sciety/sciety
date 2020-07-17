import { Middleware, RouterContext } from '@koa/router';
import { OK } from 'http-status-codes';
import { Next } from 'koa';

export default (): Middleware => (
  async ({ response }: RouterContext, next: Next): Promise<void> => {
    response.status = OK;
    response.body = 'User-Agent: *\nDisallow: /\n';

    await next();
  }
);
