import { Middleware } from 'koa';
import * as TE from 'fp-ts/TaskEither';
import { flow } from 'fp-ts/function';
import * as t from 'io-ts';
import { handleScietyApiCommand } from './api/handle-sciety-api-command';
import { validateInputShape } from '../write-side/commands/validate-input-shape';

import { CollectedPorts } from '../infrastructure';
import { CommandHandler, GenericCommand } from '../types/command-handler';

export const createApiRouteForCommand = <C extends GenericCommand>(
  adapters: CollectedPorts,
  codec: t.Decoder<unknown, C>,
  commandHandler: CommandHandler<C>,
): Middleware => handleScietyApiCommand(adapters, flow(
    validateInputShape(codec),
    TE.fromEither,
    TE.chain(commandHandler),
  ));
