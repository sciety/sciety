import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as B from 'fp-ts/boolean';
import { constant, flow, pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import * as Doi from '../types/doi';
import {
  DomainEvent, isUserSavedArticleEvent, userSavedArticle, UserSavedArticleEvent,
} from '../types/domain-events';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

const isCommand = (command: string): command is 'save-article' => command === 'save-article';

const isMatchingSavedEvent = (userId: UserId, articleId: Doi.Doi) => (event: DomainEvent) => (
  isUserSavedArticleEvent(event) && event.userId === userId && Doi.eqDoi.equals(event.articleId, articleId)
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
    O.Do,
    O.apS('articleId', pipe(context.session.articleId, Doi.fromString)),
    O.apS('command', pipe(context.session.command, O.fromNullable, O.filter(isCommand))),
    O.fold(
      () => T.of(undefined),
      ({ articleId }) => pipe(
        getAllEvents,
        T.chain(flow(
          RA.some(isMatchingSavedEvent(user.id, articleId)),
          B.fold(
            () => [userSavedArticle(user.id, articleId)],
            constant([]),
          ),
          commitEvents,
        )),
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
