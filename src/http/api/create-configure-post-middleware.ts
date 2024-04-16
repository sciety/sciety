import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as t from 'io-ts';
import { Middleware } from 'koa';
import bodyParser from 'koa-bodyparser';
import compose from 'koa-compose';
import { CollectedPorts } from '../../infrastructure';
import { GenericCommand } from '../../types/command-handler';
import { executeCommand } from '../../write-side/commands';
import { ResourceAction } from '../../write-side/resources/resource-action';

const executeAndRespond = <C extends GenericCommand>(
  dependencies: CollectedPorts,
  codec: t.Decoder<unknown, C>,
  resourceAction: ResourceAction<C>,
  expectedToken: string,
): Middleware => async (context) => {
    dependencies.logger('debug', 'Received command', {
      body: context.request.body,
      url: context.request.url,
    });

    if (context.request.headers.authorization !== `Bearer ${expectedToken}`) {
      context.response.status = StatusCodes.FORBIDDEN;
      context.response.body = { error: 'Unauthorized' };
      return;
    }

    const commandResult = await pipe(
      context.request.body,
      executeCommand(dependencies, codec, resourceAction),
    )();
    if (E.isLeft(commandResult)) {
      context.response.status = StatusCodes.BAD_REQUEST;
      context.response.body = { error: commandResult.left };
      return;
    }

    context.response.status = commandResult.right === 'events-created' ? StatusCodes.CREATED : StatusCodes.OK;
    context.response.body = { commandResult };
  };

export const createConfigurePostMiddleware = (
  ports: CollectedPorts,
  expectedToken: string,
) => <C extends GenericCommand>(
  codec: t.Decoder<unknown, C>,
  resourceAction: ResourceAction<C>,
): Middleware => compose(
    [
      bodyParser({ enableTypes: ['json'] }),
      executeAndRespond(ports, codec, resourceAction, expectedToken),
    ],
  );
