import { Middleware } from '@koa/router';
import createVoteCommand, { CommitEvents, GetAllEvents } from './vote-command';
import { Logger } from '../infrastructure/logger';
import toReviewId from '../types/review-id';
import { User } from '../types/user';

type Ports = {
  logger: Logger;
  commitEvents: CommitEvents;
  getAllEvents: GetAllEvents;
};

export default (ports: Ports): Middleware<{ user: User }> => async (context, next) => {
  const voteCommand = createVoteCommand(ports.getAllEvents, ports.commitEvents);
  const { user } = context.state;
  const reviewId = toReviewId(context.request.body.reviewid);
  await voteCommand(user, reviewId);

  // TODO: code is in the wrong place
  ports.logger('info', 'User voted', { user });

  context.redirect('back');

  await next();
};
