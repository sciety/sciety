import * as TE from 'fp-ts/TaskEither';
import { Middleware } from 'koa';
import bodyParser from 'koa-bodyparser';
import compose from 'koa-compose';
import { logRequestBody } from './log-request-body';
import { redirectBack } from './redirect-back';
import { Adapters } from '../infrastructure';
import { CommandResult } from '../types/command-result';

type ScietyApiCommandHandler = (adapters: Adapters) => (input: unknown) => TE.TaskEither<string, CommandResult>;

type HandleCreateAnnotationCommand = (adapters: Adapters, handler: ScietyApiCommandHandler) => Middleware;

export const handleCreateAnnotationCommand: HandleCreateAnnotationCommand = (adapters) => compose([
  bodyParser({ enableTypes: ['form'] }),
  logRequestBody(adapters.logger),
  redirectBack,
]);
