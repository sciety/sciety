import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as PR from 'io-ts/PathReporter';
import { Middleware } from 'koa';
import { removeArticleFromListCommandCodec } from '../../commands/remove-article-from-list';
import { removeArticleFromListCommandHandler } from '../../remove-article-from-list';
import {
  CommitEvents, GetAllEvents, GetList, Logger,
} from '../../shared-ports';
import * as DE from '../../types/data-error';
import * as LOID from '../../types/list-owner-id';
import { User } from '../../types/user';
import { UserId } from '../../types/user-id';

type Ports = { logger: Logger, getAllEvents: GetAllEvents, commitEvents: CommitEvents, getList: GetList };

type FormBody = {
  articleid: unknown,
  listid: unknown,
};

const handleFormSubmission = (adapters: Ports, userId: UserId) => (formBody: FormBody) => pipe(
  {
    articleId: formBody.articleid,
    listId: formBody.listid,
  },
  removeArticleFromListCommandCodec.decode,
  E.bimap(
    (errors) => pipe(
      errors,
      PR.failure,
      (fails) => adapters.logger('error', 'invalid remove article from list form command', { fails }),
    ),
    (command) => {
      adapters.logger('info', 'received remove article from list form command', { command });
      return command;
    },
  ),
  TE.fromEither,
  TE.chainW((command) => pipe(
    command.listId,
    adapters.getList,
    TE.fromOption(() => DE.notFound),
    TE.chainEitherK((list) => {
      if (!LOID.eqListOwnerId.equals(list.ownerId, LOID.fromUserId(userId))) {
        adapters.logger('error', 'List owner id does not match user id', {
          listId: list.listId,
          listOwnerId: list.ownerId,
          userId,
        });

        return E.left(DE.unavailable);
      }
      adapters.logger('info', 'List owner id matches user id', {
        listId: list.listId,
        listOwnerId: list.ownerId,
        userId,
      });

      return E.right(command);
    }),
  )),
  TE.chainW(removeArticleFromListCommandHandler(adapters)),
);

export const removeArticleFromList = (adapters: Ports): Middleware => async (context, next) => {
  const user = context.state.user as User;
  await pipe(
    context.request.body,
    handleFormSubmission(adapters, user.id),
    TE.mapLeft(() => {
      context.redirect('/action-failed');
    }),
    TE.chainTaskK(() => async () => {
      await next();
    }),
  )();
};
