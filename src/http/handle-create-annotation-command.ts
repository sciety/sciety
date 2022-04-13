import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import bodyParser from 'koa-bodyparser';
import compose from 'koa-compose';
import { redirectBack } from './redirect-back';
import { Adapters, Logger } from '../infrastructure';
import { CommandResult } from '../types/command-result';

type ScietyApiCommandHandler = (adapters: Adapters) => (input: unknown) => TE.TaskEither<string, CommandResult>;

type HandleCreateAnnotationCommand = (adapters: Adapters, handler: ScietyApiCommandHandler) => Middleware;

const logCommand = (logger: Logger): Middleware => async (context, next) => {
  pipe(
    context.request.body,
    (body) => ({
      content: body.annotationContent,
      target: {
        articleId: body.articleId,
      },
    }),
    (command) => logger(
      'debug',
      'Received command',
      {
        command,
        url: context.request.url,
      },
    ),
  );

  await next();
};

export const handleCreateAnnotationCommand: HandleCreateAnnotationCommand = (adapters) => compose([
  bodyParser({ enableTypes: ['form'] }),
  logCommand(adapters.logger),
  redirectBack,
]);
