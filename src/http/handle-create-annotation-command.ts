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

type CreateAnnotationCommand = {
  content: string,
  target: {
    articleId: string,
  },
};

const logCommand = (logger: Logger, url: string) => (command: CreateAnnotationCommand) => logger(
  'debug',
  'Received command',
  {
    command,
    url,
  },
);

type Body = {
  annotationContent: string,
  articleId: string,
};

const translateCommand = ({ annotationContent, articleId }: Body): CreateAnnotationCommand => ({
  content: annotationContent,
  target: {
    articleId,
  },
});

const translateAndLogCommand = (logger: Logger): Middleware => async (context, next) => {
  pipe(
    context.request.body,
    translateCommand,
    logCommand(logger, context.request.url),
  );

  await next();
};

export const handleCreateAnnotationCommand: HandleCreateAnnotationCommand = (adapters) => compose([
  bodyParser({ enableTypes: ['form'] }),
  translateAndLogCommand(adapters.logger),
  redirectBack,
]);
