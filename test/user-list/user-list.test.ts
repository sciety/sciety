import { userSavedArticle } from '../../src/types/domain-events';
import { commandHandler } from '../../src/user-list/user-list';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('user-list', () => {
  describe('when receiving a RemoveArticleFromUserList Command', () => {
    describe('given a user list that has never contained the article', () => {
      it('does not create new events', () => {
        const removeArticleFromUserList = {
          type: 'RemoveArticleFromUserList' as const,
          articleId: arbitraryDoi(),
          userId: arbitraryUserId(),
        };
        const createdEvents = commandHandler([], removeArticleFromUserList);

        expect(createdEvents).toStrictEqual([]);
      });
    });

    describe('given a user list where the article has already been saved', () => {
      it.skip('creates a ArticleRemovedFromUserList Event', () => {
        const articleId = arbitraryDoi();
        const userId = arbitraryUserId();
        const removeArticleFromUserList = {
          type: 'RemoveArticleFromUserList' as const,
          articleId,
          userId,
        };
        const events = [
          userSavedArticle(userId, articleId),
        ];
        const createdEvents = commandHandler(events, removeArticleFromUserList);

        expect(createdEvents).toStrictEqual([expect.objectContaining({
          type: 'ArticleRemovedFromUserList',
          articleId,
          userId,
        })]);
      });
    });

    describe('given a user list where the article has already been removed', () => {
      it.todo('does not create new events');
    });
  });
});
