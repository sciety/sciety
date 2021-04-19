import { Middleware } from 'koa';
import { finishFollowCommand } from '../follow';
import { Adapters } from '../infrastructure/adapters';

export const finishCommand = (adapters: Adapters): Middleware => async (context, next) => {
  if (context.session.command === 'follow') {
    await finishFollowCommand(adapters)(context, next);
  }
  await next();
};
