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

// ts-unused-exports:disable-next-line
export const commandHandler: CommandHandler = () => [];
