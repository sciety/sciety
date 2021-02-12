import { Middleware } from 'koa';

export const onlyIfNotAuthenticated = (original: Middleware): Middleware => async (context, next) => {
  if (!(context.state.user)) {
    await original(context, next);
  } else {
    await next();
  }
};
