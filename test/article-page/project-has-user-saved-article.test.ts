import * as T from 'fp-ts/lib/Task';
import { GetEvents, projectHasUserSavedArticle } from '../../src/article-page/project-has-user-saved-article';
import Doi from '../../src/types/doi';
import { userSavedArticle } from '../../src/types/domain-events';
import { toUserId } from '../../src/types/user-id';

describe('project-has-user-saved-article', () => {
  describe('when the user has saved the article', () => {
    it('returns true', async () => {
      const getEvents: GetEvents = T.of([
        userSavedArticle(toUserId('this-user'), new Doi('10.1101/111111')),
      ]);
      const result = await projectHasUserSavedArticle(getEvents)(
        new Doi('10.1101/111111'),
        toUserId('this-user'),
      )();

      expect(result).toBe(true);
    });
  });

  describe('when the user has not saved the article', () => {
    it('returns false', async () => {
      const getEvents: GetEvents = T.of([]);
      const result = await projectHasUserSavedArticle(getEvents)(
        new Doi('10.1101/some-doi'),
        toUserId('this-user'),
      )();

      expect(result).toBe(false);
    });
  });

  describe('when the user has saved a different article', () => {
    it('returns false', async () => {
      const getEvents: GetEvents = T.of([
        userSavedArticle(toUserId('this-user'), new Doi('10.1101/111111')),
      ]);
      const result = await projectHasUserSavedArticle(getEvents)(
        new Doi('10.1101/some-other-doi'),
        toUserId('this-user'),
      )();

      expect(result).toBe(false);
    });
  });

  describe('when a different user has saved this article', () => {
    it('returns false', async () => {
      const getEvents: GetEvents = T.of([
        userSavedArticle(toUserId('other-user'), new Doi('10.1101/111111')),
      ]);
      const result = await projectHasUserSavedArticle(getEvents)(
        new Doi('10.1101/111111'),
        toUserId('this-user'),
      )();

      expect(result).toBe(false);
    });
  });
});
