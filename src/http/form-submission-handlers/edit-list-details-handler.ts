import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { checkUserOwnsList, Dependencies as CheckUserOwnsListDependencies } from './check-user-owns-list';
import { ensureUserIsLoggedIn, Dependencies as EnsureUserIsLoggedInDependencies } from './ensure-user-is-logged-in';
import { validateCommandShape } from './validate-command-shape';
import { Payload } from '../../infrastructure/logger';
import { EditListDetails, Logger } from '../../shared-ports';
import { EditListDetailsCommand, editListDetailsCommandCodec } from '../../write-side/commands/edit-list-details';

type Dependencies = CheckUserOwnsListDependencies & EnsureUserIsLoggedInDependencies & {
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
  const loggedInUser = ensureUserIsLoggedIn(dependencies, context, 'You must be logged in to feature a list.');
  if (O.isNone(loggedInUser)) {
    return;
  }
  await pipe(
    {
      command: pipe(
        context.request.body,
        validateCommandShape(editListDetailsCommandCodec),
      ),
    },
    sequenceS(E.Apply),
    TE.fromEither,
    TE.chainFirstEitherKW(({ command }) => (
      checkUserOwnsList(dependencies, command.listId, loggedInUser.value.id)
    )),
    TE.chainW(({ command }) => pipe(
      command,
      handleCommand(dependencies),
      TE.map(() => loggedInUser.value),
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
