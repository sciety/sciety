import { commandHandler } from '../../src/user-list/user-list';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('user-list', () => {
  describe('when receiving a RemoveArticleFromUserList Command', () => {
    describe('given a user list that has never contained the article', () => {
      it('does not create new events', () => {
        const inList = false;
        const removeArticleFromUserList = {
          type: 'RemoveArticleFromUserList' as const,
          articleId: arbitraryDoi(),
          userId: arbitraryUserId(),
        };
        const createdEvents = commandHandler(inList, removeArticleFromUserList);

        expect(createdEvents).toStrictEqual([]);
      });
    });

    describe('given a user list where the article has already been saved', () => {
      describe('single article saved to list', () => {
        it('creates a ArticleRemovedFromUserList Event', () => {
          const articleId = arbitraryDoi();
          const userId = arbitraryUserId();
          const inList = true;
          const removeArticleFromUserList = {
            type: 'RemoveArticleFromUserList' as const,
            articleId,
            userId,
          };
          const createdEvents = commandHandler(inList, removeArticleFromUserList);

          expect(createdEvents).toStrictEqual([expect.objectContaining({
            type: 'ArticleRemovedFromUserList',
            articleId,
            userId,
          })]);
        });
      });

      describe('multiple articles saved to list', () => {
        it('creates a ArticleRemovedFromUserList Event', () => {
          const articleId = arbitraryDoi();
          const userId = arbitraryUserId();
          const inList = true;
          const removeArticleFromUserList = {
            type: 'RemoveArticleFromUserList' as const,
            articleId,
            userId,
          };
          const createdEvents = commandHandler(inList, removeArticleFromUserList);

          expect(createdEvents).toStrictEqual([expect.objectContaining({
            type: 'ArticleRemovedFromUserList',
            articleId,
            userId,
          })]);
        });
      });
    });

    describe('given a user list where the article has already been removed', () => {
      it.skip('does not create new events', () => {
        const articleId = arbitraryDoi();
        const userId = arbitraryUserId();
        const inList = false;
        const removeArticleFromUserList = {
          type: 'RemoveArticleFromUserList' as const,
          articleId,
          userId,
        };
        const createdEvents = commandHandler(inList, removeArticleFromUserList);

        expect(createdEvents).toStrictEqual([]);
      });
    });
  });
});
