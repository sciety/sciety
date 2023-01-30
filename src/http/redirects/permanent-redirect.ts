import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';

export const permanentRedirect = (
  constructUrl: (params: Record<string, string>) => string,
): Middleware => async (context, next) => {
  context.status = StatusCodes.PERMANENT_REDIRECT;
  context.redirect(constructUrl(context.params));

  await next();
};
