import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { articleSaveState } from './article-save-state';
import { commandHandler } from './command-handler';
import { DomainEvent, UserSavedArticleEvent, UserUnsavedArticleEvent } from '../domain-events';
import { Command } from '../types/command';
import { User } from '../types/user';

export type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

export const saveArticleEvents = (
  ports: Ports,
) => (
  user: User, command: Command,
): T.Task<ReadonlyArray<UserUnsavedArticleEvent | UserSavedArticleEvent>> => pipe(
  ports.getAllEvents,
  T.map(articleSaveState(user.id, command.articleId)),
  T.map(commandHandler(command, user.id)),
);
