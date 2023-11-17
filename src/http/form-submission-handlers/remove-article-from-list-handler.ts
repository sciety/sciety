import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { flow, pipe } from 'fp-ts/function';
import * as PR from 'io-ts/PathReporter';
import { Middleware } from 'koa';
import { checkUserOwnsList, Ports as CheckUserOwnsListPorts } from './check-user-owns-list.js';
import { removeArticleFromListCommandCodec } from '../../write-side/commands/remove-article-from-list.js';
import { removeArticleFromListCommandHandler } from '../../write-side/command-handlers/index.js';
import { Logger } from '../../shared-ports/index.js';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../authentication-and-logging-in-of-sciety-users.js';
import { UserDetails } from '../../types/user-details.js';
import { DependenciesForCommands } from '../../write-side/dependencies-for-commands.js';

type Ports = DependenciesForCommands & CheckUserOwnsListPorts & GetLoggedInScietyUserPorts & {
  logger: Logger,
};

type FormBody = {
  articleid: unknown,
  listid: unknown,
};

const handleFormSubmission = (dependencies: Ports, userDetails: O.Option<UserDetails>) => (formBody: FormBody) => pipe(
  {
    articleId: formBody.articleid,
    listId: formBody.listid,
  },
  removeArticleFromListCommandCodec.decode,
  E.bimap(
    (errors) => pipe(
      errors,
      PR.failure,
      (fails) => dependencies.logger('error', 'invalid remove article from list form command', { fails }),
    ),
    (command) => {
      dependencies.logger('info', 'received remove article from list form command', { command });
      return command;
    },
  ),
  E.chainW((command) => pipe(
    userDetails,
    O.match(
      () => {
        dependencies.logger('error', 'Logged in user not found', { command });
        return E.left(undefined);
      },
      (user) => E.right({
        command,
        userId: user.id,
      }),
    ),
  )),
  TE.fromEither,
  TE.chainFirstEitherKW(flow(
    ({ command, userId }) => checkUserOwnsList(dependencies, command.listId, userId),
    E.mapLeft((logEntry) => {
      dependencies.logger('error', logEntry.message, logEntry.payload);
      return logEntry;
    }),
  )),
  TE.map(({ command }) => command),
  TE.chainW(removeArticleFromListCommandHandler(dependencies)),
);

const requestCodec = t.type({
  body: t.type({
    articleid: t.unknown,
    listid: t.unknown,
  }),
});

export const removeArticleFromListHandler = (dependencies: Ports): Middleware => async (context, next) => {
  const user = getLoggedInScietyUser(dependencies, context);
  await pipe(
    context.request,
    requestCodec.decode,
    TE.fromEither,
    TE.map((request) => request.body),
    TE.chainW(handleFormSubmission(dependencies, user)),
    TE.mapLeft(() => {
      context.redirect('/action-failed');
    }),
    TE.chainTaskK(() => async () => {
      await next();
    }),
  )();
};
