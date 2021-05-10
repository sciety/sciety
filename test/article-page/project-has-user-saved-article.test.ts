import * as T from 'fp-ts/Task';
import { projectHasUserSavedArticle } from '../../src/article-page/project-has-user-saved-article';
import { Doi } from '../../src/types/doi';
import { userSavedArticle } from '../../src/types/domain-events';
import { toUserId } from '../../src/types/user-id';
import { arbitraryDoi } from '../types/doi.helper';

describe('project-has-user-saved-article', () => {
  describe('when the user has saved the article', () => {
    it('returns true', async () => {
      const getEvents = T.of([
        userSavedArticle(toUserId('this-user'), new Doi('10.1101/111111')),
      ]);
      const result = await projectHasUserSavedArticle(
        new Doi('10.1101/111111'),
        toUserId('this-user'),
      )(getEvents)();

      expect(result).toBe(true);
    });
  });

  describe('when the user has not saved the article', () => {
    it('returns false', async () => {
      const getEvents = T.of([]);
      const result = await projectHasUserSavedArticle(
        arbitraryDoi(),
        toUserId('this-user'),
      )(getEvents)();

      expect(result).toBe(false);
    });
  });

  describe('when the user has saved a different article', () => {
    it('returns false', async () => {
      const getEvents = T.of([
        userSavedArticle(toUserId('this-user'), arbitraryDoi()),
      ]);
      const result = await projectHasUserSavedArticle(
        arbitraryDoi(),
        toUserId('this-user'),
      )(getEvents)();

      expect(result).toBe(false);
    });
  });

  describe('when a different user has saved this article', () => {
    it('returns false', async () => {
      const getEvents = T.of([
        userSavedArticle(toUserId('other-user'), new Doi('10.1101/111111')),
      ]);
      const result = await projectHasUserSavedArticle(
        new Doi('10.1101/111111'),
        toUserId('this-user'),
      )(getEvents)();

      expect(result).toBe(false);
    });
  });
});
