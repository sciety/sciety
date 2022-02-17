import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';

export const ownedBy: Middleware = async ({ response }, next) => {
  response.set({ 'Content-Type': 'application/json' });
  response.status = StatusCodes.OK;
  response.body = { items: [] };

  await next();
};
