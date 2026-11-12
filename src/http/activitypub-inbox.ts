import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';

export const activitypubInbox = (): Middleware => (
  async ({ response }, next) => {
    response.status = StatusCodes.ACCEPTED;
    response.body = 'Not implemented: activities sent to this inbox are discarded';

    await next();
  }
);
