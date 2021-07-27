import { Doi } from '../types/doi';
import {
  articleRemovedFromUserList,
  ArticleRemovedFromUserListEvent,
} from '../types/domain-events';
import { UserId } from '../types/user-id';

type Command = {
  articleId: Doi,
  userId: UserId,
  type: 'RemoveArticleFromUserList',
};

type CommandHandler = (
  inList: boolean,
  command: Command
) => ReadonlyArray<ArticleRemovedFromUserListEvent>;

// ts-unused-exports:disable-next-line
export const commandHandler: CommandHandler = (articleAlreadyInList, command) => (
  articleAlreadyInList
    ? [articleRemovedFromUserList(command.userId, command.articleId)]
    : []
);
