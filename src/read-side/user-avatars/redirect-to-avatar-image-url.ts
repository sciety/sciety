import { Middleware } from '@koa/router';

export const redirectToAvatarImageUrl = (): Middleware => async (context, next) => {
  await next();
};
