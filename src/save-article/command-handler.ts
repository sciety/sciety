import { Doi } from '../types/doi';
import {
  userSavedArticle,
  UserSavedArticleEvent, userUnsavedArticle, UserUnsavedArticleEvent,
} from '../types/domain-events';
import { UserId } from '../types/user-id';

type Command = {
  articleId: Doi,
  userId: UserId,
  type: 'RemoveArticleFromUserList' | 'SaveArticleToUserList',
};

export type SaveState = 'saved' | 'not-saved';

type CommandHandler = (
  command: Command,
) => (
  saveState: SaveState,
) => ReadonlyArray<UserUnsavedArticleEvent | UserSavedArticleEvent>;

const handleRemoveCommand = (saveState: SaveState, command: Command) => (
  saveState === 'saved'
    ? [userUnsavedArticle(command.userId, command.articleId)]
    : []);

const handleSaveCommand = (saveState: SaveState, command: Command) => (
  saveState === 'not-saved'
    ? [userSavedArticle(command.userId, command.articleId)]
    : []);

export const commandHandler: CommandHandler = (command) => (saveState) => {
  switch (command.type) {
    case 'SaveArticleToUserList':
      return handleSaveCommand(saveState, command);
    case 'RemoveArticleFromUserList':
      return handleRemoveCommand(saveState, command);
  }
};
