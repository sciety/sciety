import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import * as Doi from '../types/doi';
import {
  DomainEvent,
  UserSavedArticleEvent, UserUnsavedArticleEvent,
} from '../types/domain-events';
import { User } from '../types/user';
import { articleSaveState } from '../user-list/article-save-state';
import { commandHandler } from '../user-list/command-handler';

const isCommand = (command: string): command is 'save-article' => command === 'save-article';

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: (events: ReadonlyArray<UserSavedArticleEvent | UserUnsavedArticleEvent>) => T.Task<void>,
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
          (events) => articleSaveState(events, user.id, articleId),
          (state) => commandHandler(state, {
            articleId,
            userId: user.id,
            type: 'SaveArticleToUserList' as const,
          }),
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
