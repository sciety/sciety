import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { articleSaveState } from './article-save-state';
import { commandHandler } from './command-handler';
import { encodedCommandFieldName } from './save-save-article-command';
import {
  DomainEvent,
  UserSavedArticleEvent, UserUnsavedArticleEvent,
} from '../domain-events';
import { CommandFromString } from '../types/command';
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
    context.request.body[encodedCommandFieldName],
    CommandFromString.decode,
    E.fold(
      () => { throw new Error('Failed to decode command'); },
      (command) => pipe(
        getAllEvents,
        T.chain(flow(
          articleSaveState(user.id, command.articleId),
          commandHandler(command, user.id),
          commitEvents,
        )),
      ),
    ),
  )();

  await next();
};
