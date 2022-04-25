import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import bodyParser from 'koa-bodyparser';
import compose from 'koa-compose';
import { redirectBack } from '../http/redirect-back';
import { CommandResult } from '../types/command-result';

type CommandHandler = (input: unknown) => TE.TaskEither<string, CommandResult>;

type SupplyFormSubmissionTo = (handler: CommandHandler) => Middleware;

export const supplyFormSubmissionTo: SupplyFormSubmissionTo = (handler) => compose([
  bodyParser({ enableTypes: ['form'] }),
  async (context, next) => {
    await pipe(
      context.request.body,
      handler,
    )();

    await next();
  },
  redirectBack,
]);
