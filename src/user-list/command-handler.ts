import { Doi } from '../types/doi';
import {
  articleRemovedFromUserList,
  ArticleRemovedFromUserListEvent,
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
) => ReadonlyArray<ArticleRemovedFromUserListEvent>;

// ts-unused-exports:disable-next-line
export const commandHandler: CommandHandler = (saveState, command) => (
  saveState === 'saved'
    ? [articleRemovedFromUserList(command.userId, command.articleId)]
    : []
);
