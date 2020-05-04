import { OK } from 'http-status-codes';
import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';

export default (): Middleware => (
  async ({ response }: RouterContext, next: Next): Promise<void> => {
    response.set('Cache-Control', 'no-store, must-revalidate');
    response.status = OK;
    response.body = 'pong';

    await next();
  }
);
