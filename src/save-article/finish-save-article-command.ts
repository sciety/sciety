import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { constant, pipe } from 'fp-ts/lib/function';
import { Middleware } from 'koa';
import { Doi } from '../types/doi';
import {
  DomainEvent, isUserSavedArticleEvent, userSavedArticle, UserSavedArticleEvent,
} from '../types/domain-events';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

const validateCommand = O.fromPredicate((command): boolean => (
  command === 'save-article'
));

const isMatchingSavedEvent = (userId: UserId, articleId: Doi) => (event: DomainEvent) => (
  isUserSavedArticleEvent(event) && event.userId === userId && event.articleId.value === articleId.value
);

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: (events: ReadonlyArray<UserSavedArticleEvent>) => T.Task<void>,
};

export const finishSaveArticleCommand = (
  { getAllEvents, commitEvents }: Ports,
): Middleware => async (context, next) => {
  const user = context.state.user as User;
  await pipe(
    context.session.command,
    O.fromNullable,
    O.chain(validateCommand),
    O.fold(
      () => T.of(undefined),
      () => pipe(
        getAllEvents,
        T.map(RA.some(isMatchingSavedEvent(user.id, new Doi(context.session.articleId)))),
        T.map(B.fold(
          () => [userSavedArticle(user.id, new Doi(context.session.articleId))],
          constant([]),
        )),
        T.chain(commitEvents),
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
