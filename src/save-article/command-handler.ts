import {
  userSavedArticle,
  UserSavedArticleEvent, userUnsavedArticle, UserUnsavedArticleEvent,
} from '../domain-events';
import { Command } from '../types/command';
import { UserId } from '../types/user-id';

export type SaveState = 'saved' | 'not-saved';

type CommandHandler = (
  command: Command,
  userId: UserId
) => (
  saveState: SaveState,
) => ReadonlyArray<UserUnsavedArticleEvent | UserSavedArticleEvent>;

const handleUnsaveCommand = (saveState: SaveState, command: Command, userId: UserId) => (
  saveState === 'saved'
    ? [userUnsavedArticle(userId, command.articleId)]
    : []);

const handleSaveCommand = (saveState: SaveState, command: Command, userId: UserId) => (
  saveState === 'not-saved'
    ? [userSavedArticle(userId, command.articleId)]
    : []);

export const commandHandler: CommandHandler = (command, userId) => (saveState) => {
  switch (command.type) {
    case 'SaveArticle':
      return handleSaveCommand(saveState, command, userId);
    case 'UnsaveArticle':
      return handleUnsaveCommand(saveState, command, userId);
  }
};
