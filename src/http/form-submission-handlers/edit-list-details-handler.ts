import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { checkUserOwnsList, Dependencies as CheckUserOwnsListDependencies } from './check-user-owns-list';
import { decodeFormSubmission } from './decode-form-submission';
import { ensureUserIsLoggedIn, Dependencies as EnsureUserIsLoggedInDependencies } from './ensure-user-is-logged-in';
import { Payload } from '../../infrastructure/logger';
import { Logger } from '../../shared-ports';
import { EditListDetailsCommand, editListDetailsCommandCodec } from '../../write-side/commands/edit-list-details';
import { DependenciesForCommands } from '../../write-side/dependencies-for-commands';
import { executeResourceAction } from '../../write-side/resources/execute-resource-action';
import * as listResource from '../../write-side/resources/list';

type Dependencies = CheckUserOwnsListDependencies & EnsureUserIsLoggedInDependencies & DependenciesForCommands & {
  logger: Logger,
};

const handleCommand = (dependencies: Dependencies) => (command: EditListDetailsCommand) => pipe(
  command,
  executeResourceAction(dependencies, listResource.update),
  TE.mapLeft((errorMessage) => ({
    message: 'Command handler failed',
    payload: {
      errorMessage,
    },
  })),
);

export const editListDetailsHandler = (dependencies: Dependencies): Middleware => async (context) => {
  const loggedInUser = ensureUserIsLoggedIn(dependencies, context, 'You must be logged in to edit a list.');
  if (O.isNone(loggedInUser)) {
    return;
  }
  const command = decodeFormSubmission(dependencies, context, editListDetailsCommandCodec, loggedInUser.value.id);
  if (E.isLeft(command)) {
    return;
  }

  await pipe(
    checkUserOwnsList(dependencies, command.right.listId, loggedInUser.value.id),
    TE.fromEither,
    TE.chainW(() => pipe(
      command.right,
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
