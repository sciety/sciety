import { Middleware } from '@koa/router';
import { Logger } from '../infrastructure/logger';
import { User } from '../types/user';

type Ports = {
  logger: Logger;
};

export default (ports: Ports): Middleware<{ user: User }> => async (context, next) => {
  const { user } = context.state;

  ports.logger('info', 'User voted', { user });

  context.redirect('back');

  await next();
};
