import * as T from 'fp-ts/Task';
import { projectHasUserSavedArticle } from '../../src/article-page/project-has-user-saved-article';
import { userSavedArticle, userUnsavedArticle } from '../../src/domain-events';
import { Doi } from '../../src/types/doi';

import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('project-has-user-saved-article', () => {
  describe('when the user has saved the article', () => {
    it('returns true', async () => {
      const userId = arbitraryUserId();
      const getEvents = T.of([
        userSavedArticle(userId, new Doi('10.1101/111111')),
      ]);
      const result = await projectHasUserSavedArticle(
        new Doi('10.1101/111111'),
        userId,
      )(getEvents)();

      expect(result).toBe(true);
    });
  });

  describe('when the user has not saved the article', () => {
    it('returns false', async () => {
      const getEvents = T.of([]);
      const result = await projectHasUserSavedArticle(
        arbitraryDoi(),
        arbitraryUserId(),
      )(getEvents)();

      expect(result).toBe(false);
    });
  });

  describe('when the user has saved and unsaved the article', () => {
    it('returns false', async () => {
      const userId = arbitraryUserId();
      const articleId = arbitraryDoi();
      const getEvents = T.of([
        userSavedArticle(userId, articleId),
        userUnsavedArticle(userId, articleId),
      ]);
      const result = await projectHasUserSavedArticle(
        articleId,
        userId,
      )(getEvents)();

      expect(result).toBe(false);
    });
  });

  describe('when the user has saved a different article', () => {
    it('returns false', async () => {
      const userId = arbitraryUserId();
      const getEvents = T.of([
        userSavedArticle(userId, arbitraryDoi()),
      ]);
      const result = await projectHasUserSavedArticle(
        arbitraryDoi(),
        userId,
      )(getEvents)();

      expect(result).toBe(false);
    });
  });

  describe('when a different user has saved this article', () => {
    it('returns false', async () => {
      const getEvents = T.of([
        userSavedArticle(arbitraryUserId(), new Doi('10.1101/111111')),
      ]);
      const result = await projectHasUserSavedArticle(
        new Doi('10.1101/111111'),
        arbitraryUserId(),
      )(getEvents)();

      expect(result).toBe(false);
    });
  });
});
