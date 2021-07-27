import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Doi } from '../types/doi';
import {
  articleRemovedFromUserList,
  ArticleRemovedFromUserListEvent,
  DomainEvent,
  isUserSavedArticleEvent,
} from '../types/domain-events';
import { UserId } from '../types/user-id';

type Command = {
  articleId: Doi,
  userId: UserId,
  type: 'RemoveArticleFromUserList',
};
type CommandHandler = (
  events: ReadonlyArray<DomainEvent>,
  command: Command
) => ReadonlyArray<ArticleRemovedFromUserListEvent>;

// ts-unused-exports:disable-next-line
export const commandHandler: CommandHandler = (events, command) => pipe(
  events,
  RA.filter(isUserSavedArticleEvent),
  (relevantEvents) => (
    relevantEvents.length === 0 ? [] : [articleRemovedFromUserList(command.userId, command.articleId)]
  ),
);
