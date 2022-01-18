import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import bodyParser from 'koa-bodyparser';
import compose from 'koa-compose';
import { logCommand } from './log-command';
import { requireBearerToken } from './require-bearer-token';
import { Adapters } from '../infrastructure';
import { CommandResult } from '../types/command-result';

type ScietyApiCommandHandler = (adapters: Adapters) => (input: unknown) => TE.TaskEither<string, CommandResult>;

export const handleScietyApiCommand = (adapters: Adapters, handler: ScietyApiCommandHandler): Middleware => compose([
  bodyParser({ enableTypes: ['json'] }),
  logCommand(adapters.logger),
  requireBearerToken,
  async (context) => {
    await pipe(
      context.request.body,
      handler(adapters),
      TE.match(
        (error) => {
          context.response.status = StatusCodes.BAD_REQUEST;
          context.response.body = error;
        },
        (eventsCreated) => {
          context.response.status = eventsCreated === 'events-created' ? StatusCodes.CREATED : StatusCodes.OK;
          context.response.body = '';
        },
      ),
    )();
  },
]);
