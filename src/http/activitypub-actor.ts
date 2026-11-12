import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';

export const activitypubActor = (): Middleware => (
  async ({ response }, next) => {
    response.status = StatusCodes.OK;
    response.body = '';

    await next();
  }
);
