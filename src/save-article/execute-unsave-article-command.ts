import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { articleSaveState } from './article-save-state';
import { commandHandler } from './command-handler';
import {
  DomainEvent,
  UserSavedArticleEvent, UserUnsavedArticleEvent,
} from '../domain-events';
import * as Doi from '../types/doi';
import { User } from '../types/user';

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: (events: ReadonlyArray<UserSavedArticleEvent | UserUnsavedArticleEvent>) => T.Task<void>,
};

export const articleIdFieldName = 'articleid';

export const unsaveArticle = (
  { getAllEvents, commitEvents }: Ports,
): Middleware => async (context, next) => {
  const user = context.state.user as User;
  await pipe(
    context.request.body[articleIdFieldName],
    Doi.fromString,
    O.fold(
      () => { throw new Error('no articleId passed to unsaveArticle'); },
      (articleId) => pipe(
        getAllEvents,
        T.chain(flow(
          articleSaveState(user.id, articleId),
          commandHandler(
            {
              articleId,
              type: 'UnsaveArticle' as const,
            },
            user.id,
          ),
          commitEvents,
        )),
      ),
    ),
  )();

  await next();
};
