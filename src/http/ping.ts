import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';

export const ping = (): Middleware => (
  async ({ response }, next) => {
    response.set('Cache-Control', 'no-store, must-revalidate');
    response.status = StatusCodes.OK;
    response.body = 'pong';

    await next();
  }
);
