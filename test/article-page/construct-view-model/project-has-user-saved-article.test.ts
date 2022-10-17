import { pipe } from 'fp-ts/function';
import { projectHasUserSavedArticle } from '../../../src/article-page/construct-view-model/project-has-user-saved-article';
import { userSavedArticle, userUnsavedArticle } from '../../../src/domain-events';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

const userId = arbitraryUserId();
const articleId = arbitraryArticleId();

describe('project-has-user-saved-article', () => {
  describe('when the user has saved the article', () => {
    it('returns true', () => {
      const result = pipe(
        [
          userSavedArticle(userId, articleId),
        ],
        projectHasUserSavedArticle(articleId, userId),
      );

      expect(result).toBe(true);
    });
  });

  describe('when the user has not saved the article', () => {
    it('returns false', () => {
      const result = pipe(
        [],
        projectHasUserSavedArticle(articleId, userId),
      );

      expect(result).toBe(false);
    });
  });

  describe('when the user has saved and unsaved the article', () => {
    it('returns false', () => {
      const result = pipe(
        [
          userSavedArticle(userId, articleId),
          userUnsavedArticle(userId, articleId),
        ],
        projectHasUserSavedArticle(articleId, userId),
      );

      expect(result).toBe(false);
    });
  });

  describe('when the user has saved a different article', () => {
    it('returns false', () => {
      const result = pipe(
        [
          userSavedArticle(userId, arbitraryArticleId()),
        ],
        projectHasUserSavedArticle(articleId, userId),
      );

      expect(result).toBe(false);
    });
  });

  describe('when a different user has saved this article', () => {
    it('returns false', () => {
      const result = pipe(
        [
          userSavedArticle(arbitraryUserId(), articleId),
        ],
        projectHasUserSavedArticle(articleId, arbitraryUserId()),
      );

      expect(result).toBe(false);
    });
  });
});
