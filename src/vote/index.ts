import { Middleware } from '@koa/router';
import createVoteCommand from './vote-command';
import { Logger } from '../infrastructure/logger';
import { User } from '../types/user';

type Ports = {
  logger: Logger;
};

export default (ports: Ports): Middleware<{ user: User }> => async (context, next) => {
  const voteCommand = createVoteCommand();
  const { user } = context.state;

  await voteCommand();

  // TODO: code is in the wrong place
  ports.logger('info', 'User voted', { user });

  context.redirect('back');

  await next();
};
