import { Middleware } from 'koa';
import { commandHandler, CommitEvents, GetAllEvents } from './command-handler';
import toReviewId from '../types/review-id';

type Ports = {
  commitEvents: CommitEvents;
  getAllEvents: GetAllEvents;
};

export const finishRespondCommand = (ports: Ports): Middleware => async (context, next) => {
  const command = context.session.command as string;
  if (
    (command === 'respond-helpful'
      || command === 'revoke-response'
      || command === 'respond-not-helpful')
     && context.session.reviewId
  ) {
    const { user } = context.state;
    const reviewId = toReviewId(context.session.reviewId);

    await commandHandler(
      ports.commitEvents,
      ports.getAllEvents,
      command,
      user.id,
      reviewId,
    )();

    delete context.session.command;
    delete context.session.editorialCommunityId;
  }

  await next();
};
