import { Middleware } from '@koa/router';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as T from 'fp-ts/lib/Task';
import * as B from 'fp-ts/lib/boolean';
import { constant, pipe } from 'fp-ts/lib/function';
import Doi from '../types/doi';
import {
  DomainEvent, isUserSavedArticleEvent, userSavedArticle, UserSavedArticleEvent,
} from '../types/domain-events';

import { User } from '../types/user';

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>;
  commitEvents: (events: ReadonlyArray<UserSavedArticleEvent>) => T.Task<void>,
};

export const saveArticleHandler = (ports: Ports): Middleware<{ user: User }> => async (context, next) => {
  const user = context.state.user as User;
  const articleId = new Doi(context.request.body.articleid);
  await pipe(
    ports.getAllEvents,
    T.map(RA.some((event) => (
      isUserSavedArticleEvent(event) && event.userId === user.id && event.articleId.value === articleId.value))),
    T.map(B.fold(
      () => [userSavedArticle(user.id, articleId)],
      constant([]),
    )),
    T.chain(ports.commitEvents),
  )();

  context.redirect('back');

  await next();
};
