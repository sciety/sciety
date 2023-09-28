import { Middleware, ParameterizedContext } from 'koa';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { StatusCodes } from 'http-status-codes';
import { CommandHandler, GenericCommand } from '../types/command-handler';
import { CollectedPorts } from '../infrastructure';
import { validateInputShape } from '../write-side/commands/validate-input-shape';
import { getSecretSafely } from './api/get-secret-safely';

const executeAndRespond = async <C extends GenericCommand>(
  codec: t.Decoder<unknown, C>,
  commandHandler: CommandHandler<C>,
  context: ParameterizedContext,
) => {
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
};

export const createApiRouteForCommand = <C extends GenericCommand>(
  ports: CollectedPorts,
  codec: t.Decoder<unknown, C>,
  commandHandler: CommandHandler<C>,
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
      context.response.body = 'Unauthorized';
      context.response.status = StatusCodes.FORBIDDEN;
      return undefined;
    }
    await executeAndRespond(codec, commandHandler, context);
  };
