import { Doi } from '../types/doi';
import { ArticleRemovedFromUserListEvent, DomainEvent } from '../types/domain-events';
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const commandHandler: CommandHandler = (events, command) => [];
