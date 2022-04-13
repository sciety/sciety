import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import bodyParser from 'koa-bodyparser';
import compose from 'koa-compose';
import { redirectBack } from './redirect-back';
import { CommandResult } from '../types/command-result';

type ScietyApiCommandHandler = (input: unknown) => TE.TaskEither<string, CommandResult>;

type HandleCreateAnnotationCommand = (handler: ScietyApiCommandHandler) => Middleware;

export const handleCreateAnnotationCommand: HandleCreateAnnotationCommand = (handler) => compose([
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
