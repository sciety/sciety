import { Doi } from '../types/doi';
import {
  articleRemovedFromUserList,
  ArticleRemovedFromUserListEvent, userSavedArticle, UserSavedArticleEvent,
} from '../types/domain-events';
import { UserId } from '../types/user-id';

type Command = {
  articleId: Doi,
  userId: UserId,
  type: 'RemoveArticleFromUserList' | 'SaveArticleToUserList',
};

export type SaveState = 'saved' | 'not-saved';

type CommandHandler = (
  saveState: SaveState,
  command: Command
) => ReadonlyArray<ArticleRemovedFromUserListEvent | UserSavedArticleEvent>;

const handleRemoveCommand = (saveState: SaveState, command: Command) => (
  saveState === 'saved'
    ? [articleRemovedFromUserList(command.userId, command.articleId)]
    : []);

const handleSaveCommand = (saveState: SaveState, command: Command) => (
  saveState === 'not-saved'
    ? [userSavedArticle(command.userId, command.articleId)]
    : []);

// ts-unused-exports:disable-next-line
export const commandHandler: CommandHandler = (saveState, command) => {
  switch (command.type) {
    case 'SaveArticleToUserList':
      return handleSaveCommand(saveState, command);
    case 'RemoveArticleFromUserList':
      return handleRemoveCommand(saveState, command);
  }
};
