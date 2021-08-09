import { Middleware } from 'koa';

export const encodedCommandFieldName = 'encoded-command';

export const saveCommand: Middleware = async (context, next) => {
  context.session[encodedCommandFieldName] = context.request.body[encodedCommandFieldName];
  await next();
};
