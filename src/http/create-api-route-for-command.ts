import { Middleware } from 'koa';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { StatusCodes } from 'http-status-codes';
import bodyParser from 'koa-bodyparser';
import compose from 'koa-compose';
import { CommandHandler, GenericCommand } from '../types/command-handler';
import { CollectedPorts } from '../infrastructure';
import { validateInputShape } from '../write-side/commands/validate-input-shape';
import { logRequestBody } from './api/log-request-body';
import { requireBearerToken } from './api/require-bearer-token';

export const createApiRouteForCommand = <C extends GenericCommand>(
  ports: CollectedPorts,
  codec: t.Decoder<unknown, C>,
  commandHandler: CommandHandler<C>,
): Middleware => compose([
    bodyParser({ enableTypes: ['json'] }),
    logRequestBody(ports.logger),
    requireBearerToken,
    async (context) => {
      await pipe(
        context.request.body,
        validateInputShape(codec),
        TE.fromEither,
        TE.chain(commandHandler),
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
