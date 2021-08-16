import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { encodedCommandFieldName } from './save-command';
import {
  DomainEvent,
  UserSavedArticleEvent, UserUnsavedArticleEvent,
} from '../domain-events';
import { articleSaveState } from '../save-article/article-save-state';
import { commandHandler } from '../save-article/command-handler';
import { Command, CommandFromString } from '../types/command';
import { User } from '../types/user';

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: (events: ReadonlyArray<UserSavedArticleEvent | UserUnsavedArticleEvent>) => T.Task<void>,
};

const eventsFromCommand = (ports: Ports) => (user: User, command: Command) => pipe(
  ports.getAllEvents,
  T.map(articleSaveState(user.id, command.articleId)),
  T.map(commandHandler(command, user.id)),
);

export const finishSavedCommand = (
  ports: Ports,
): Middleware => async (context, next) => {
  const user = context.state.user as User;
  await pipe(
    context.session[encodedCommandFieldName],
    CommandFromString.decode,
    E.fold(
      () => T.of(undefined),
      (command) => pipe(
        eventsFromCommand(ports)(user, command),
        T.chain(ports.commitEvents),
        T.map(() => {
          delete context.session[encodedCommandFieldName];
          return undefined;
        }),
      ),
    ),
  )();

  await next();
};
