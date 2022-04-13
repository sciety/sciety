import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import bodyParser from 'koa-bodyparser';
import compose from 'koa-compose';
import { redirectBack } from './redirect-back';
import { Adapters } from '../infrastructure';
import { CommandResult } from '../types/command-result';

type ScietyApiCommandHandler = (adapters: Adapters) => (input: unknown) => TE.TaskEither<string, CommandResult>;

type HandleCreateAnnotationCommand = (adapters: Adapters, handler: ScietyApiCommandHandler) => Middleware;

export const handleCreateAnnotationCommand: HandleCreateAnnotationCommand = (adapters, handler) => compose([
  bodyParser({ enableTypes: ['form'] }),
  async (context, next) => {
    await pipe(
      context.request.body,
      handler(adapters),
    )();

    await next();
  },
  redirectBack,
]);
