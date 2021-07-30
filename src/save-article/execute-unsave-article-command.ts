import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { articleSaveState } from './article-save-state';
import { commandHandler } from './command-handler';
import * as Doi from '../types/doi';
import {
  DomainEvent,
  UserSavedArticleEvent, UserUnsavedArticleEvent,
} from '../types/domain-events';
import { User } from '../types/user';

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: (events: ReadonlyArray<UserSavedArticleEvent | UserUnsavedArticleEvent>) => T.Task<void>,
};

export const unsaveArticle = (
  { getAllEvents, commitEvents }: Ports,
): Middleware => async (context, next) => {
  const user = context.state.user as User;
  await pipe(
    context.request.body.articleid,
    Doi.fromString,
    O.fold(
      () => { throw new Error('no articleId passed to unsaveArticle'); },
      (articleId) => pipe(
        getAllEvents,
        T.chain(flow(
          (events) => articleSaveState(events, user.id, articleId),
          commandHandler({
            articleId,
            userId: user.id,
            type: 'RemoveArticleFromUserList' as const,
          }),
          commitEvents,
        )),
      ),
    ),
  )();

  await next();
};
