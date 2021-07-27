import * as T from 'fp-ts/Task';
import { Doi } from '../../../src/types/doi';
import { articleRemovedFromUserList, userSavedArticle } from '../../../src/types/domain-events';
import { savedArticleDois } from '../../../src/user-list-page/saved-articles/saved-article-dois';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('saved-article-dois', () => {
  describe('when the user has saved articles', () => {
    it('returns the DOIs of the saved articles', async () => {
      const userId = arbitraryUserId();
      const getAllEvents = T.of([
        userSavedArticle(userId, new Doi('10.1101/12345')),
        userSavedArticle(userId, new Doi('10.1101/67890')),
      ]);
      const output = await savedArticleDois(getAllEvents)(userId)();
      const expected = [
        new Doi('10.1101/67890'),
        new Doi('10.1101/12345'),
      ];

      expect(output).toStrictEqual(expected);
    });

    describe('and has removed one article', () => {
      it('only returns the DOIs of the remaining saved articles', async () => {
        const userId = arbitraryUserId();
        const getAllEvents = T.of([
          userSavedArticle(userId, new Doi('10.1101/12345')),
          userSavedArticle(userId, new Doi('10.1101/67890')),
          articleRemovedFromUserList(userId, new Doi('10.1101/12345')),
        ]);
        const output = await savedArticleDois(getAllEvents)(userId)();
        const expected = [
          new Doi('10.1101/67890'),
        ];

        expect(output).toStrictEqual(expected);
      });
    });
  });

  describe('when another user has saved articles and the current user has not', () => {
    it('returns an empty array', async () => {
      const getAllEvents = T.of([
        userSavedArticle(arbitraryUserId(), arbitraryDoi()),
      ]);

      const output = await savedArticleDois(getAllEvents)(arbitraryUserId())();

      expect(output).toStrictEqual([]);
    });
  });

  describe('when the user has not saved articles', () => {
    it('returns an empty array', async () => {
      const getAllEvents = T.of([]);

      const output = await savedArticleDois(getAllEvents)(arbitraryUserId())();

      expect(output).toStrictEqual([]);
    });
  });
});
