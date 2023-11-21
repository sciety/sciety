import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import * as PR from 'io-ts/PathReporter';
import { Middleware } from 'koa';
import { RemoveArticleFromListCommand, removeArticleFromListCommandCodec } from '../../write-side/commands';
import { checkUserOwnsList, Ports as CheckUserOwnsListPorts } from './check-user-owns-list';
import { removeArticleFromListCommandHandler } from '../../write-side/command-handlers';
import { Logger } from '../../shared-ports';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../authentication-and-logging-in-of-sciety-users';
import { UserDetails } from '../../types/user-details';
import { DependenciesForCommands } from '../../write-side/dependencies-for-commands';

type Ports = DependenciesForCommands & CheckUserOwnsListPorts & GetLoggedInScietyUserPorts & {
  logger: Logger,
};

const logInvalidCommand = (dependencies: Ports, errors: t.Errors) => pipe(
  errors,
  PR.failure,
  (fails) => dependencies.logger('error', 'invalid remove article from list form command', { fails }),
);

const logValidCommand = (dependencies: Ports, command: RemoveArticleFromListCommand) => {
  dependencies.logger('info', 'received remove article from list form command', { command });
};

const handleFormSubmission = (
  dependencies: Ports,
  userDetails: O.Option<UserDetails>,
) => (cmd: RemoveArticleFromListCommand) => {
  if (O.isNone(userDetails)) {
    dependencies.logger('error', 'Logged in user not found', { command: cmd });
    return TE.left(undefined);
  }

  const ownershipCheckResult = checkUserOwnsList(dependencies, cmd.listId, userDetails.value.id);
  if (E.isLeft(ownershipCheckResult)) {
    dependencies.logger('error', ownershipCheckResult.left.message, ownershipCheckResult.left.payload);
    return TE.left(undefined);
  }

  return pipe(
    removeArticleFromListCommandHandler(dependencies)(cmd),
    TE.mapLeft(() => undefined),
  );
};

const requestCodec = t.type({
  body: t.type({
    articleid: t.unknown,
    listid: t.unknown,
  }),
});

export const removeArticleFromListHandler = (dependencies: Ports): Middleware => async (context) => {
  const user = getLoggedInScietyUser(dependencies, context);
  const formRequest = requestCodec.decode(context.request);
  if (E.isLeft(formRequest)) {
    context.redirect('/action-failed');
    return;
  }

  const cmd = removeArticleFromListCommandCodec.decode(
    {
      articleId: formRequest.right.body.articleid,
      listId: formRequest.right.body.listid,
    },
  );

  if (E.isLeft(cmd)) {
    logInvalidCommand(dependencies, cmd.left);
    context.redirect('/action-failed');
    return;
  }

  logValidCommand(dependencies, cmd.right);

  const commandResult = await handleFormSubmission(dependencies, user)(cmd.right)();

  if (E.isLeft(commandResult)) {
    context.redirect('/action-failed');
    return;
  }

  context.redirect('back');
};
