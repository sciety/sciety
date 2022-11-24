import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import {
  AddArticleToList, SelectAllListsOwnedBy,
} from '../shared-ports';
import { CommandResult } from '../types/command-result';
import * as Doi from '../types/doi';
import { ErrorMessage, toErrorMessage } from '../types/error-message';
import * as LOID from '../types/list-owner-id';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

const isCommand = (command: string): command is 'save-article' => command === 'save-article';

type Ports = {
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
  addArticleToList: AddArticleToList,
};

type HandleWithAddArticleToListCommand = (
  userId: UserId,
  articleId: Doi.Doi,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
  addArticleToList: AddArticleToList
) => TE.TaskEither<ErrorMessage, CommandResult>;

const handleWithAddArticleToListCommand: HandleWithAddArticleToListCommand = (
  userId,
  articleId,
  selectAllListsOwnedBy,
  addArticleToList,
) => pipe(
  userId,
  LOID.fromUserId,
  selectAllListsOwnedBy,
  RA.head,
  TE.fromOption(() => toErrorMessage('finishSaveArticleCommand: Cannot find list for user')),
  TE.map((list) => ({ articleId, listId: list.listId })),
  TE.chain(addArticleToList),
);

export const finishSaveArticleCommand = (
  {
    selectAllListsOwnedBy, addArticleToList,
  }: Ports,
): Middleware => async (context, next) => {
  const user = context.state.user as User;
  await pipe(
    {
      articleId: pipe(context.session.articleId, Doi.fromString),
      command: pipe(context.session.command, O.fromNullable, O.filter(isCommand)),
    },
    sequenceS(O.Apply),
    O.fold(
      () => T.of(undefined),
      ({ articleId }) => pipe(
        handleWithAddArticleToListCommand(user.id, articleId, selectAllListsOwnedBy, addArticleToList),
        T.map(() => {
          delete context.session.command;
          delete context.session.articleId;
          return undefined;
        }),
      ),
    ),
  )();

  await next();
};
