import { Middleware } from '@koa/router';
import createVoteCommand, { CommitEvents } from './vote-command';
import { Logger } from '../infrastructure/logger';
import Doi from '../types/doi';
import HypothesisAnnotationId from '../types/hypothesis-annotation-id';
import { User } from '../types/user';

type Ports = {
  logger: Logger;
  commitEvents: CommitEvents;
};

export default (ports: Ports): Middleware<{ user: User }> => async (context, next) => {
  const voteCommand = createVoteCommand(ports.commitEvents);
  const { user } = context.state;
  const input = context.request.body.reviewid;
  const reviewId = input.startsWith('doi:') ? new Doi(input) : new HypothesisAnnotationId(input);
  await voteCommand(reviewId);

  // TODO: code is in the wrong place
  ports.logger('info', 'User voted', { user });

  context.redirect('back');

  await next();
};
