import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as PR from 'io-ts/PathReporter';
import { Middleware } from 'koa';
import { checkUserOwnsList } from './check-user-owns-list';
import { removeArticleFromListCommandCodec } from '../../commands/remove-article-from-list';
import { removeArticleFromListCommandHandler } from '../../remove-article-from-list';
import {
  CommitEvents, GetAllEvents, GetList, Logger,
} from '../../shared-ports';
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
  TE.chainFirstW(flow(
    (command) => checkUserOwnsList(adapters, command.listId, userId),
    TE.mapLeft((logEntry) => {
      adapters.logger('error', logEntry.message, logEntry.payload);
      return logEntry;
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
