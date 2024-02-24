import { Middleware } from 'koa';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { StatusCodes } from 'http-status-codes';
import bodyParser from 'koa-bodyparser';
import compose from 'koa-compose';
import { GenericCommand } from '../write-side/command-handlers/command-handler';
import { CollectedPorts } from '../infrastructure';
import { ResourceAction } from '../write-side/resources/resource-action';
import { executeCommand } from '../write-side/commands';
import { getSecretSafely } from './api/get-secret-safely';

const executeAndRespond = <C extends GenericCommand>(
  ports: CollectedPorts,
  codec: t.Decoder<unknown, C>,
  resourceAction: ResourceAction<C>,
): Middleware => async (context) => {
    ports.logger(
      'debug',
      'Received command',
      {
        body: context.request.body,
        url: context.request.url,
      },
    );

    const expectedToken = getSecretSafely(process.env.SCIETY_TEAM_API_BEARER_TOKEN);
    if (context.request.headers.authorization !== `Bearer ${expectedToken}`) {
      context.response.status = StatusCodes.FORBIDDEN;
      context.response.body = { error: 'Unauthorized' };
      return;
    }

    const commandResult = await pipe(
      context.request.body,
      executeCommand(ports, codec, resourceAction),
    )();
    if (E.isLeft(commandResult)) {
      context.response.status = StatusCodes.BAD_REQUEST;
      context.response.body = { error: commandResult.left };
      return;
    }

    context.response.status = commandResult.right === 'events-created' ? StatusCodes.CREATED : StatusCodes.OK;
    context.response.body = { commandResult };
  };

export const createApiRouteForResourceAction = <C extends GenericCommand>(
  ports: CollectedPorts,
  codec: t.Decoder<unknown, C>,
  resourceAction: ResourceAction<C>,
): Middleware => compose(
    [
      bodyParser({ enableTypes: ['json'] }),
      executeAndRespond(ports, codec, resourceAction),
    ],
  );
