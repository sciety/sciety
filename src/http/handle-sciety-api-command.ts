import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import bodyParser from 'koa-bodyparser';
import compose from 'koa-compose';
import { logRequestBody } from './log-request-body';
import { requireBearerToken } from './require-bearer-token';
import { CollectedPorts } from '../infrastructure';
import { CommandResult } from '../types/command-result';

type ScietyApiCommandHandler = (ports: CollectedPorts) => (input: unknown) => TE.TaskEither<string, CommandResult>;

export const handleScietyApiCommand = (
  ports: CollectedPorts,
  handler: ScietyApiCommandHandler,
): Middleware => compose([
  bodyParser({ enableTypes: ['json'] }),
  logRequestBody(ports.logger),
  requireBearerToken,
  async (context) => {
    await pipe(
      context.request.body,
      handler(ports),
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
