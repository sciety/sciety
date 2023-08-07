import { Middleware } from 'koa';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { StatusCodes } from 'http-status-codes';
import bodyParser from 'koa-bodyparser';
import compose from 'koa-compose';
import { GenericCommand } from '../types/command-handler';
import { CollectedPorts } from '../infrastructure';
import { logRequestBody } from './api/log-request-body';
import { requireBearerToken } from './api/require-bearer-token';
import { ResourceAction } from '../write-side/resources/resource-action';
import { executeCommand } from '../write-side/commands';

const executeAndRespond = <C extends GenericCommand>(
  ports: CollectedPorts,
  codec: t.Decoder<unknown, C>,
  resourceAction: ResourceAction<C>,
): Middleware => async (context) => {
    await pipe(
      context.request.body,
      executeCommand(ports, codec, resourceAction),
      TE.match(
        (error) => {
          context.response.status = StatusCodes.BAD_REQUEST;
          context.response.body = { error };
        },
        (eventsCreated) => {
          context.response.status = eventsCreated === 'events-created' ? StatusCodes.CREATED : StatusCodes.OK;
          context.response.body = '';
        },
      ),
    )();
  };

export const createApiRouteForResourceAction = <C extends GenericCommand>(
  ports: CollectedPorts,
  codec: t.Decoder<unknown, C>,
  resourceAction: ResourceAction<C>,
): Middleware => compose(
    [
      bodyParser({ enableTypes: ['json'] }),
      logRequestBody(ports.logger),
      requireBearerToken,
      executeAndRespond(ports, codec, resourceAction),
    ],
  );
