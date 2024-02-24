import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { sequenceS } from 'fp-ts/Apply';
import { checkUserOwnsList } from './check-user-owns-list.js';
import { EditListDetailsCommand, editListDetailsCommandCodec } from '../../write-side/commands/edit-list-details.js';
import { Payload } from '../../infrastructure/logger/index.js';
import { Logger } from '../../infrastructure/index.js';
import { getLoggedInScietyUser } from '../authentication-and-logging-in-of-sciety-users.js';
import { validateCommandShape } from './validate-command-shape.js';
import { CommandHandlers } from '../../write-side/command-handlers/index.js';
import { Queries } from '../../read-models/index.js';

type Ports = Queries & CommandHandlers & { logger: Logger };

const handleCommand = (adapters: Ports) => (command: EditListDetailsCommand) => pipe(
  command,
  adapters.editListDetails,
  TE.mapLeft((errorMessage) => ({
    message: 'Command handler failed',
    payload: {
      errorMessage,
    },
  })),
);

export const editListDetailsHandler = (adapters: Ports): Middleware => async (context) => {
  await pipe(
    {
      userDetails: pipe(
        getLoggedInScietyUser(adapters, context),
        E.fromOption(() => ({
          message: 'No authenticated user',
          payload: { formBody: context.request.body },
          errorType: 'codec-failed' as const,
        })),
      ),
      command: pipe(
        context.request.body,
        validateCommandShape(editListDetailsCommandCodec),
      ),
    },
    sequenceS(E.Apply),
    TE.fromEither,
    TE.chainFirstEitherKW(({ command, userDetails }) => checkUserOwnsList(adapters, command.listId, userDetails.id)),
    TE.chainW(({ command, userDetails }) => pipe(
      command,
      handleCommand(adapters),
      TE.map(() => userDetails),
    )),
    TE.match(
      (error: { errorType?: string, message: string, payload: Payload }) => {
        adapters.logger('error', error.message, error.payload);
        context.redirect(`/action-failed${error.errorType ? `?errorType=${error.errorType}` : ''}`);
      },
      ({ handle }) => {
        context.redirect(`/users/${handle}/lists`);
      },
    ),
  )();
};
