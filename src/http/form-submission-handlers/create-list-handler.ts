import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { ensureUserIsLoggedIn, Dependencies as EnsureUserIsLoggedInDependencies } from './ensure-user-is-logged-in';
import * as LID from '../../types/list-id';
import * as LOID from '../../types/list-owner-id';
import { DependenciesForCommands } from '../../write-side';
import { CreateListCommand } from '../../write-side/commands';
import { executeResourceAction } from '../../write-side/resources/execute-resource-action';
import * as list from '../../write-side/resources/list';

type Dependencies = DependenciesForCommands & EnsureUserIsLoggedInDependencies;

export const createListHandler = (dependencies: Dependencies): Middleware => async (context) => {
  const loggedInUserId = ensureUserIsLoggedIn(dependencies, context, 'You must be logged in to feature a list.');
  if (O.isNone(loggedInUserId)) {
    return;
  }

  const command: CreateListCommand = {
    listId: LID.generate(),
    ownerId: LOID.fromUserId(loggedInUserId.value),
    name: 'Untitled',
    description: '',
  };

  const commandResult = await pipe(
    command,
    executeResourceAction(dependencies)(list.create),
  )();
  if (E.isRight(commandResult)) {
    context.redirect(`/lists/${command.listId}/edit-details`);
    return;
  }
  dependencies.logger('error', 'Command handler failed', { errorMessage: commandResult.left });
  context.redirect('back');
};
