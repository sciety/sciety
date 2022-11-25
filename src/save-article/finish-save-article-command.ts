import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Middleware } from 'koa';
import { AddArticleToListCommand } from '../commands/add-article-to-list';
import {
  AddArticleToList, Logger, SelectAllListsOwnedBy,
} from '../shared-ports';
import { DoiFromString } from '../types/codecs/DoiFromString';
import * as Doi from '../types/doi';
import { ErrorMessage, toErrorMessage } from '../types/error-message';
import * as LOID from '../types/list-owner-id';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type Ports = {
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
  addArticleToList: AddArticleToList,
  logger: Logger,
};

type ConstructCommand = (
  ports: Ports,
  userId: UserId,
  articleId: Doi.Doi,
) => TE.TaskEither<ErrorMessage, AddArticleToListCommand>;

const constructCommand: ConstructCommand = (
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
        constructCommand(ports, user.id, articleId),
        TE.chain(ports.addArticleToList),
        TE.getOrElseW((error) => {
          ports.logger('error', 'finishSaveArticleCommand failed', { error });
          return T.of(error);
        }),
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
