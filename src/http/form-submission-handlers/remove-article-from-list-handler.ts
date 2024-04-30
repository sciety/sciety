import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as PR from 'io-ts/PathReporter';
import { Middleware } from 'koa';
import { checkUserOwnsList, Dependencies as CheckUserOwnsListDependencies } from './check-user-owns-list';
import { Logger } from '../../shared-ports';
import { removeArticleFromListCommandHandler } from '../../write-side/command-handlers';
import { RemoveArticleFromListCommand, removeArticleFromListCommandCodec } from '../../write-side/commands';
import { DependenciesForCommands } from '../../write-side/dependencies-for-commands';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserDependencies } from '../authentication-and-logging-in-of-sciety-users';

type Dependencies = DependenciesForCommands & CheckUserOwnsListDependencies & GetLoggedInScietyUserDependencies & {
  logger: Logger,
};

const logCodecError = (dependencies: Dependencies, errors: t.Errors) => pipe(
  errors,
  PR.failure,
  (fails) => dependencies.logger('error', 'invalid remove article from list form command', { fails }),
);

const logCodecSuccess = (dependencies: Dependencies, command: RemoveArticleFromListCommand) => {
  dependencies.logger('info', 'received remove article from list form command', { command });
};

const requestCodec = t.type({
  body: t.type({
    articleid: t.unknown,
    listid: t.unknown,
  }),
});

export const removeArticleFromListHandler = (dependencies: Dependencies): Middleware => async (context) => {
  const user = getLoggedInScietyUser(dependencies, context);
  const formRequest = requestCodec.decode(context.request);
  if (E.isLeft(formRequest)) {
    context.redirect('/action-failed');
    return;
  }

  const command = removeArticleFromListCommandCodec.decode(
    {
      articleId: formRequest.right.body.articleid,
      listId: formRequest.right.body.listid,
    },
  );

  if (E.isLeft(command)) {
    logCodecError(dependencies, command.left);
    context.redirect('/action-failed');
    return;
  }

  logCodecSuccess(dependencies, command.right);

  if (O.isNone(user)) {
    dependencies.logger('error', 'Logged in user not found', { command });
    context.redirect('/action-failed');
    return;
  }

  const ownershipCheckResult = checkUserOwnsList(dependencies, command.right.listId, user.value.id);
  if (E.isLeft(ownershipCheckResult)) {
    dependencies.logger('error', ownershipCheckResult.left.message, ownershipCheckResult.left.payload);
    context.redirect('/action-failed');
    return;
  }

  const commandResult = await removeArticleFromListCommandHandler(dependencies)(command.right)();

  if (E.isLeft(commandResult)) {
    context.redirect('/action-failed');
    return;
  }

  context.redirect(`/lists/${command.right.listId}`);
};
