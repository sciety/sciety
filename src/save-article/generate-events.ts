import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { articleSaveState } from './article-save-state';
import { commandHandler, SaveArticleCommand, SaveArticleEvents } from './command-handler';
import { DomainEvent } from '../domain-events';
import { User } from '../types/user';

export type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

export const generateEvents = (
  ports: Ports,
) => (
  user: User, command: SaveArticleCommand,
): T.Task<ReadonlyArray<SaveArticleEvents>> => pipe(
  ports.getAllEvents,
  T.map(articleSaveState(user.id, command.articleId)),
  T.map(commandHandler(command, user.id)),
);
