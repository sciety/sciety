import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { Middleware } from 'koa';
import { ensureUserIsLoggedIn, Dependencies as EnsureUserIsLoggedInDependencies } from './ensure-user-is-logged-in';
import { Logger } from '../../logger';
import { CommandHandler } from '../../types/command-handler';
import * as LID from '../../types/list-id';
import * as LOID from '../../types/list-owner-id';
import { CreateListCommand } from '../../write-side/commands';
import { Dependencies as GetLoggedInScietyUserDependencies } from '../authentication-and-logging-in-of-sciety-users';

type Dependencies = GetLoggedInScietyUserDependencies & EnsureUserIsLoggedInDependencies & {
  logger: Logger,
  createList: CommandHandler<CreateListCommand>,
};

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

  const commandResult = await dependencies.createList(command)();
  if (E.isRight(commandResult)) {
    context.redirect(`/lists/${command.listId}/edit-details`);
    return;
  }
  dependencies.logger('error', 'Command handler failed', { errorMessage: commandResult.left });
  context.redirect('back');
};
