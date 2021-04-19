import { Middleware } from 'koa';
import { finishFollowCommand } from '../follow';
import { sessionGroupProperty } from '../follow/finish-follow-command';
import { Adapters } from '../infrastructure/adapters';

export const finishCommand = (adapters: Adapters): Middleware => async (context, next) => {
  if (context.session.command === 'follow') {
    await finishFollowCommand(adapters)(context.session[sessionGroupProperty])(context, next);
    delete context.session.command;
    delete context.session[sessionGroupProperty];
  }
  await next();
};
