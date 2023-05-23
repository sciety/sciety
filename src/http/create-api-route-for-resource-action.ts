import { Middleware } from 'koa';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { StatusCodes } from 'http-status-codes';
import bodyParser from 'koa-bodyparser';
import compose from 'koa-compose';
import { GenericCommand } from '../types/command-handler';
import { CollectedPorts } from '../infrastructure';
import { validateInputShape } from '../write-side/commands/validate-input-shape';
import { logRequestBody } from './api/log-request-body';
import { requireBearerToken } from './api/require-bearer-token';
import { ResourceAction } from '../write-side/resources/resource-action';

const executeAndRespond = <C extends GenericCommand>(
  ports: CollectedPorts,
  codec: t.Decoder<unknown, C>,
  resourceAction: ResourceAction<C>,
): Middleware => async (context) => {
    await pipe(
      context.request.body,
      validateInputShape(codec),
      TE.fromEither,
      TE.chain((command) => pipe(
        ports.getAllEvents,
        TE.rightTask,
        TE.chainEitherKW(resourceAction(command)),
        TE.chainTaskK(ports.commitEvents),
      )),
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
  };

// ts-unused-exports:disable-next-line
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
