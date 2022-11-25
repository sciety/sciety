import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Middleware } from 'koa';
import {
  AddArticleToList, SelectAllListsOwnedBy,
} from '../shared-ports';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { CommandResult } from '../types/command-result';
import * as Doi from '../types/doi';
import { ErrorMessage, toErrorMessage } from '../types/error-message';
import * as LOID from '../types/list-owner-id';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type Ports = {
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
  addArticleToList: AddArticleToList,
};

type HandleWithAddArticleToListCommand = (
  ports: Ports,
  userId: UserId,
  articleId: Doi.Doi,
) => TE.TaskEither<ErrorMessage, CommandResult>;

const handleWithAddArticleToListCommand: HandleWithAddArticleToListCommand = (
  ports,
  userId,
  articleId,
) => pipe(
  userId,
  LOID.fromUserId,
  ports.selectAllListsOwnedBy,
  RA.head,
  TE.fromOption(() => toErrorMessage('finishSaveArticleCommand: Cannot find list for user')),
  TE.map((list) => ({ articleId, listId: list.listId })),
  TE.chain(ports.addArticleToList),
);

const contextCodec = t.type({
  session: t.type({
    articleId: DoiFromString,
    command: t.literal('save-article'),
  }),
});

export const finishSaveArticleCommand = (ports: Ports): Middleware => async (context, next) => {
  const user = context.state.user as User;
  await pipe(
    context,
    contextCodec.decode,
    E.map((ctx) => ctx.session),
    E.fold(
      () => T.of(undefined),
      ({ articleId }) => pipe(
        handleWithAddArticleToListCommand(ports, user.id, articleId),
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
