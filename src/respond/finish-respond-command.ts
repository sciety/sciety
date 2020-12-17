import { Middleware } from 'koa';

export const finishRespondCommand = (): Middleware => async (context, next) => {
  if (context.session.command === 'respond-helpful' && context.session.reviewId) {
    delete context.session.command;
    delete context.session.editorialCommunityId;
  }

  await next();
};
