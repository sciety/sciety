import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { checkUserOwnsList, Dependencies as CheckUserOwnsListDependencies } from './check-user-owns-list';
import { validateCommandShape } from './validate-command-shape';
import { Payload } from '../../infrastructure/logger';
import { EditListDetails, Logger } from '../../shared-ports';
import { EditListDetailsCommand, editListDetailsCommandCodec } from '../../write-side/commands/edit-list-details';
import { getLoggedInScietyUser, Dependencies as GetLoggedInScietyUserDependencies } from '../authentication-and-logging-in-of-sciety-users';

type Dependencies = CheckUserOwnsListDependencies & GetLoggedInScietyUserDependencies & {
  editListDetails: EditListDetails,
  logger: Logger,
};

const handleCommand = (dependencies: Dependencies) => (command: EditListDetailsCommand) => pipe(
  command,
  dependencies.editListDetails,
  TE.mapLeft((errorMessage) => ({
    message: 'Command handler failed',
    payload: {
      errorMessage,
    },
  })),
);

export const editListDetailsHandler = (dependencies: Dependencies): Middleware => async (context) => {
  await pipe(
    {
      userDetails: pipe(
        getLoggedInScietyUser(dependencies, context),
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
    TE.chainFirstEitherKW(({ command, userDetails }) => (
      checkUserOwnsList(dependencies, command.listId, userDetails.id)
    )),
    TE.chainW(({ command, userDetails }) => pipe(
      command,
      handleCommand(dependencies),
      TE.map(() => userDetails),
    )),
    TE.match(
      (error: { errorType?: string, message: string, payload: Payload }) => {
        dependencies.logger('error', error.message, error.payload);
        context.redirect(`/action-failed${error.errorType ? `?errorType=${error.errorType}` : ''}`);
      },
      ({ handle }) => {
        context.redirect(`/users/${handle}/lists`);
      },
    ),
  )();
};
