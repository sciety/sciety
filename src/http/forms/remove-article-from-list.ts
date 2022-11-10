import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as PR from 'io-ts/PathReporter';
import { Middleware } from 'koa';
import { removeArticleFromListCommandCodec } from '../../commands/remove-article-from-list';
import { removeArticleFromListCommandHandler } from '../../remove-article-from-list';
import { CommitEvents, GetAllEvents, Logger } from '../../shared-ports';
import { getList } from '../../shared-read-models/lists';
import * as DE from '../../types/data-error';
import * as LOID from '../../types/list-owner-id';
import { User } from '../../types/user';

type Ports = { logger: Logger, getAllEvents: GetAllEvents, commitEvents: CommitEvents };

export const removeArticleFromList = (adapters: Ports): Middleware => async (context, next) => {
  const user = context.state.user as User;
  const userId = user.id;
  await pipe(
    {
      articleId: context.request.body.articleid,
      listId: context.request.body.listid,
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
      adapters.getAllEvents,
      T.chain(getList(command.listId)),
      TE.chainEitherK((list) => {
        if (!LOID.eqListOwnerId.equals(list.ownerId, LOID.fromUserId(userId))) {
          adapters.logger('error', 'List owner id does not match user id', { list, userId });

          return E.left(DE.unavailable);
        }
        adapters.logger('info', 'List owner id matches user id', { list, userId });

        return E.right(command);
      }),
    )),
    TE.chainW(removeArticleFromListCommandHandler(adapters)),
    TE.mapLeft(() => {
      context.redirect('/action-failed');
    }),
    TE.chainTaskK(() => async () => {
      await next();
    }),
  )();
};
