import * as O from 'fp-ts/Option';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { finishFollowCommand } from '../follow';
import { sessionGroupProperty } from '../follow/finish-follow-command';
import { Adapters } from '../infrastructure/adapters';

export const finishCommand = (adapters: Adapters): Middleware => async (context, next) => {
  if (context.session.command === 'follow') {
    const result = await finishFollowCommand(adapters)(context.session[sessionGroupProperty], context.state.user)();
    if (O.isNone(result)) {
      context.throw(StatusCodes.BAD_REQUEST);
    }
    delete context.session.command;
    delete context.session[sessionGroupProperty];
  }
  await next();
};
