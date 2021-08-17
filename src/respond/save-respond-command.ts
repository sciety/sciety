import { Middleware } from 'koa';

export const saveRespondCommand: Middleware = async (context, next) => {
  context.session.command = context.request.body.command;
  context.session.reviewId = context.request.body.reviewid;
  await next();
};
