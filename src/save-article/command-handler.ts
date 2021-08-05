import * as t from 'io-ts';
import {
  userSavedArticle,
  UserSavedArticleEvent, userUnsavedArticle, UserUnsavedArticleEvent,
} from '../domain-events';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { UserId } from '../types/user-id';

export const commandCodec = t.type({
  articleId: DoiFromString,
  type: t.union([
    t.literal('UnsaveArticle'),
    t.literal('SaveArticle'),
  ]),
});

export type Command = t.TypeOf<typeof commandCodec>;

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
