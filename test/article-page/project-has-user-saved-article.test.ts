import * as T from 'fp-ts/lib/Task';
import { GetEvents, projectHasUserSavedArticle } from '../../src/article-page/project-has-user-saved-article';
import Doi from '../../src/types/doi';
import toUserId from '../../src/types/user-id';

const getEvents: GetEvents = T.of([
  {
    type: 'UserSavedArticle',
    date: new Date(),
    userId: toUserId('1295307136415735808'),
    articleId: new Doi('10.1101/2020.07.04.187583'),
  },
  {
    type: 'UserSavedArticle',
    date: new Date(),
    userId: toUserId('1295307136415735808'),
    articleId: new Doi('10.1101/2020.09.09.289785'),
  },
]);

describe('project-has-user-saved-article', () => {
  describe('when the user has saved the article', () => {
    it('returns true', async () => {
      const result = await projectHasUserSavedArticle(getEvents)(
        new Doi('10.1101/2020.07.04.187583'),
        toUserId('1295307136415735808'),
      )();

      expect(result).toBe(true);
    });
  });

  describe('when the user has not saved the article', () => {
    it('returns false', async () => {
      const result = await projectHasUserSavedArticle(getEvents)(
        new Doi('10.1101/some-doi'),
        toUserId('the-user'),
      )();

      expect(result).toBe(false);
    });
  });

  describe('when the user has saved another article', () => {
    it('returns false', async () => {
      const result = await projectHasUserSavedArticle(getEvents)(
        new Doi('10.1101/some-doi'),
        toUserId('1295307136415735808'),
      )();

      expect(result).toBe(false);
    });
  });

  describe('when another user has saved this article', () => {
    it('returns false', async () => {
      const result = await projectHasUserSavedArticle(getEvents)(
        new Doi('10.1101/2020.07.04.187583'),
        toUserId('the-user'),
      )();

      expect(result).toBe(false);
    });
  });
});
