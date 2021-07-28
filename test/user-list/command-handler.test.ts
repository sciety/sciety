import { commandHandler } from '../../src/user-list/command-handler';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('command-handler', () => {
  describe('article is in the list', () => {
    describe('and a RemoveArticleFromUserList Command is issued', () => {
      it('creates an ArticleRemovedFromUserList Event', () => {
        const articleId = arbitraryDoi();
        const userId = arbitraryUserId();
        const saveState = 'saved';
        const removeArticleFromUserList = {
          type: 'RemoveArticleFromUserList' as const,
          articleId,
          userId,
        };
        const createdEvents = commandHandler(saveState, removeArticleFromUserList);

        expect(createdEvents).toStrictEqual([expect.objectContaining({
          type: 'ArticleRemovedFromUserList',
          articleId,
          userId,
        })]);
      });
    });

    describe('and a SaveArticleToUserList Command is issued', () => {
      it.todo('creates no events');
    });
  });

  describe('article is not in the list', () => {
    describe('and a RemoveArticleFromUserList Command is issued', () => {
      it('creates no events', () => {
        const saveState = 'not-saved';
        const removeArticleFromUserList = {
          type: 'RemoveArticleFromUserList' as const,
          articleId: arbitraryDoi(),
          userId: arbitraryUserId(),
        };
        const createdEvents = commandHandler(saveState, removeArticleFromUserList);

        expect(createdEvents).toStrictEqual([]);
      });
    });

    describe('and a SaveArticleToUserList Command is issued', () => {
      it.todo('creates a UserSavedArticle Event');
    });
  });
});
