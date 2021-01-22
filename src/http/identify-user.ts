import { Middleware } from '@koa/router';
import { Logger } from '../infrastructure/logger';
import { User } from '../types/user';

export const identifyUser = (logger: Logger): Middleware<{ user?: User }> => (
  async (context, next) => {
    if (context.state.user) {
      logger('debug', 'User identity', { user: context.state.user });
    }

    await next();
  }
);
