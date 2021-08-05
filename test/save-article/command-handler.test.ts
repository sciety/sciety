import { commandHandler } from '../../src/save-article/command-handler';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('command-handler', () => {
  describe('article is saved', () => {
    describe('and a UnsaveArticle Command is issued', () => {
      it('creates an UserUnsavedArticle Event', () => {
        const articleId = arbitraryDoi();
        const userId = arbitraryUserId();
        const saveState = 'saved';
        const unsaveArticle = {
          type: 'UnsaveArticle' as const,
          articleId,
        };
        const createdEvents = commandHandler(unsaveArticle, userId)(saveState);

        expect(createdEvents).toStrictEqual([expect.objectContaining({
          type: 'UserUnsavedArticle',
          articleId,
          userId,
        })]);
      });
    });

    describe('and a SaveArticle Command is issued', () => {
      it('creates no events', () => {
        const articleId = arbitraryDoi();
        const userId = arbitraryUserId();
        const saveState = 'saved';
        const saveArticle = {
          type: 'SaveArticle' as const,
          articleId,
        };
        const createdEvents = commandHandler(saveArticle, userId)(saveState);

        expect(createdEvents).toStrictEqual([]);
      });
    });
  });

  describe('article is not-saved', () => {
    describe('and a UnsaveArticle Command is issued', () => {
      it('creates no events', () => {
        const saveState = 'not-saved';
        const unsaveArticle = {
          type: 'UnsaveArticle' as const,
          articleId: arbitraryDoi(),
        };
        const createdEvents = commandHandler(unsaveArticle, arbitraryUserId())(saveState);

        expect(createdEvents).toStrictEqual([]);
      });
    });

    describe('and a SaveArticle Command is issued', () => {
      it('creates a UserSavedArticle Event', () => {
        const articleId = arbitraryDoi();
        const userId = arbitraryUserId();
        const saveState = 'not-saved';
        const saveArticle = {
          type: 'SaveArticle' as const,
          articleId,
        };
        const createdEvents = commandHandler(saveArticle, userId)(saveState);

        expect(createdEvents).toStrictEqual([expect.objectContaining({
          type: 'UserSavedArticle',
          articleId,
          userId,
        })]);
      });
    });
  });
});
