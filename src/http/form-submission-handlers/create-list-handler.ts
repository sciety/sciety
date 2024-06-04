import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { ensureUserIsLoggedIn, Dependencies as EnsureUserIsLoggedInDependencies } from './ensure-user-is-logged-in';
import { CreateList, Logger } from '../../shared-ports';
import * as LID from '../../types/list-id';
import * as LOID from '../../types/list-owner-id';
import { CreateListCommand } from '../../write-side/commands';
import { Dependencies as GetLoggedInScietyUserDependencies } from '../authentication-and-logging-in-of-sciety-users';

type Dependencies = GetLoggedInScietyUserDependencies & EnsureUserIsLoggedInDependencies & {
  logger: Logger,
  createList: CreateList,
};

export const createListHandler = (dependencies: Dependencies): Middleware => async (context) => {
  const loggedInUserId = ensureUserIsLoggedIn(dependencies, context, 'You must be logged in to feature a list.');
  if (O.isNone(loggedInUserId)) {
    return;
  }

  await pipe(
    {
      listId: LID.generate(),
      ownerId: LOID.fromUserId(loggedInUserId.value),
      name: 'Untitled',
      description: '',
    } satisfies CreateListCommand,
    (command) => pipe(
      command,
      dependencies.createList,
      TE.bimap(
        (errorMessage) => ({
          message: 'Command handler failed',
          payload: {
            errorMessage,
          },
        }),
        () => command.listId,
      ),
    ),
    TE.match(
      (error) => {
        dependencies.logger('error', error.message, error.payload);
        context.redirect('back');
      },
      (listId) => {
        context.redirect(`/lists/${listId}/edit-details`);
      },
    ),
  )();
};
