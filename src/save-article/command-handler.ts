import {
  userSavedArticle,
  UserSavedArticleEvent, userUnsavedArticle, UserUnsavedArticleEvent,
} from '../domain-events';
import { Doi } from '../types/doi';
import { UserId } from '../types/user-id';

type Command = {
  articleId: Doi,
  userId: UserId,
  type: 'UnsaveArticle' | 'SaveArticle',
};

export type SaveState = 'saved' | 'not-saved';

type CommandHandler = (
  command: Command,
) => (
  saveState: SaveState,
) => ReadonlyArray<UserUnsavedArticleEvent | UserSavedArticleEvent>;

const handleUnsaveCommand = (saveState: SaveState, command: Command) => (
  saveState === 'saved'
    ? [userUnsavedArticle(command.userId, command.articleId)]
    : []);

const handleSaveCommand = (saveState: SaveState, command: Command) => (
  saveState === 'not-saved'
    ? [userSavedArticle(command.userId, command.articleId)]
    : []);

export const commandHandler: CommandHandler = (command) => (saveState) => {
  switch (command.type) {
    case 'SaveArticle':
      return handleSaveCommand(saveState, command);
    case 'UnsaveArticle':
      return handleUnsaveCommand(saveState, command);
  }
};
