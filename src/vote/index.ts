import { Middleware } from '@koa/router';
import createVoteCommand, { CommitEvents } from './vote-command';
import { Logger } from '../infrastructure/logger';
import Doi from '../types/doi';
import { User } from '../types/user';

type Ports = {
  logger: Logger;
  commitEvents: CommitEvents;
};

export default (ports: Ports): Middleware<{ user: User }> => async (context, next) => {
  const voteCommand = createVoteCommand(ports.commitEvents);
  const { user } = context.state;
  const reviewId = new Doi('10.1111/123456');
  await voteCommand(reviewId);

  // TODO: code is in the wrong place
  ports.logger('info', 'User voted', { user });

  context.redirect('back');

  await next();
};
