import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import bodyParser from 'koa-bodyparser';
import compose from 'koa-compose';
import { redirectBack } from '../http/redirect-back';
import { CommandResult } from '../types/command-result';
import { User } from '../types/user';

type CommandHandler = (input: unknown) => TE.TaskEither<unknown, CommandResult>;

type State = {
  user?: User,
};

const requireUserToBeAvasthiReading: Middleware<State> = async (context, next) => {
  if (context.state.user?.id !== '1412019815619911685') {
    context.response.status = StatusCodes.FORBIDDEN;
    context.response.body = 'Only @AvasthiReading is allowed to annotate their list.';
    return;
  }

  await next();
};

type SupplyFormSubmissionTo = (handler: CommandHandler) => Middleware;

export const supplyFormSubmissionTo: SupplyFormSubmissionTo = (handler) => compose([
  bodyParser({ enableTypes: ['form'] }),
  requireUserToBeAvasthiReading,
  async (context, next) => {
    await pipe(
      context.request.body,
      handler,
    )();

    await next();
  },
  redirectBack,
]);
