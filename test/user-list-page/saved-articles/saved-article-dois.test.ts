import { userSavedArticle, userUnsavedArticle } from '../../../src/domain-events';
import { Doi } from '../../../src/types/doi';
import { savedArticleDois } from '../../../src/user-list-page/saved-articles/saved-article-dois';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('saved-article-dois', () => {
  describe('when the user has saved articles', () => {
    it('returns the DOIs of the saved articles', async () => {
      const userId = arbitraryUserId();
      const events = [
        userSavedArticle(userId, new Doi('10.1101/12345')),
        userSavedArticle(userId, new Doi('10.1101/67890')),
      ];
      const output = savedArticleDois(events)(userId);
      const expected = [
        new Doi('10.1101/67890'),
        new Doi('10.1101/12345'),
      ];

      expect(output).toStrictEqual(expected);
    });

    describe('and has removed one article', () => {
      it('only returns the DOIs of the remaining saved articles', async () => {
        const userId = arbitraryUserId();
        const events = [
          userSavedArticle(userId, new Doi('10.1101/12345')),
          userSavedArticle(userId, new Doi('10.1101/67890')),
          userUnsavedArticle(userId, new Doi('10.1101/12345')),
        ];
        const output = savedArticleDois(events)(userId);
        const expected = [
          new Doi('10.1101/67890'),
        ];

        expect(output).toStrictEqual(expected);
      });

      it('allows the same article to be added again', async () => {
        const userId = arbitraryUserId();
        const events = [
          userSavedArticle(userId, new Doi('10.1101/12345')),
          userUnsavedArticle(userId, new Doi('10.1101/12345')),
          userSavedArticle(userId, new Doi('10.1101/12345')),
        ];
        const output = savedArticleDois(events)(userId);
        const expected = [
          new Doi('10.1101/12345'),
        ];

        expect(output).toStrictEqual(expected);
      });
    });
  });

  describe('when another user has saved articles and the current user has not', () => {
    it('returns an empty array', async () => {
      const events = [
        userSavedArticle(arbitraryUserId(), arbitraryDoi()),
      ];

      const output = savedArticleDois(events)(arbitraryUserId());

      expect(output).toStrictEqual([]);
    });
  });

  describe('when the user has not saved articles', () => {
    it('returns an empty array', async () => {
      const output = savedArticleDois([])(arbitraryUserId());

      expect(output).toStrictEqual([]);
    });
  });
});
