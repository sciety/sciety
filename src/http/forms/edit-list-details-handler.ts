import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { sequenceS } from 'fp-ts/Apply';
import { checkUserOwnsList, Ports as CheckUserOwnsListPorts } from './check-user-owns-list';
import { EditListDetailsCommand, editListDetailsCommandCodec } from '../../write-side/commands/edit-list-details';
import { EditListDetails, Logger } from '../../shared-ports';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../authentication-and-logging-in-of-sciety-users';
import { FormHandlingError } from './form-handling-error';
import { validateCommandShape } from './validate-command-shape';

type Ports = CheckUserOwnsListPorts & GetLoggedInScietyUserPorts & {
  editListDetails: EditListDetails,
  logger: Logger,
};

const handleCommand = (adapters: Ports) => (command: EditListDetailsCommand) => pipe(
  command,
  adapters.editListDetails,
  TE.mapLeft((errorMessage) => ({
    errorType: 'command-handler-failed',
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
        E.fromOption((): FormHandlingError => ({
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
    TE.chainFirstW(({ command, userDetails }) => checkUserOwnsList(adapters, command.listId, userDetails.id)),
    TE.chainW(({ command, userDetails }) => pipe(
      command,
      handleCommand(adapters),
      TE.map(() => userDetails),
    )),
    TE.match(
      (error: FormHandlingError) => {
        adapters.logger('error', `edit-list-details-handler: ${error.errorType}`, error.payload);
        context.redirect(`/action-failed${error.errorType ? `?errorType=${error.errorType}` : ''}`);
      },
      ({ handle }) => {
        context.redirect(`/users/${handle}/lists`);
      },
    ),
  )();
};
