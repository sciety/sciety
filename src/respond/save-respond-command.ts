import { Middleware, ParameterizedContext } from 'koa';

export const saveRespondCommand: Middleware = async (context: ParameterizedContext, next) => {
  context.session.command = context.request.body.command;
  context.session.reviewId = context.request.body.reviewid;
  // TODO: don't put in the session, just in the context
  context.session.targetFragmentId = context.request.body.reviewid;
  await next();
};
