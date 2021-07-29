import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { userSavedArticle, userUnsavedArticle } from '../../../src/types/domain-events';
import { getUserListDetails } from '../../../src/user-page/user-list-card/get-user-list-details';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('get-user-list-details', () => {
  describe('when the list contains no articles', () => {
    const userId = arbitraryUserId();
    const details = pipe(
      [],
      getUserListDetails(userId),
    );

    it('returns a count of 0', () => {
      expect(details.articleCount).toStrictEqual(0);
    });

    it('returns no last updated date', () => {
      expect(details.lastUpdated).toStrictEqual(O.none);
    });
  });

  describe('when the list contains some articles', () => {
    const userId = arbitraryUserId();
    const earlierDate = new Date('1970');
    const laterDate = new Date('2020');
    const details = pipe(
      [
        userSavedArticle(userId, arbitraryDoi(), earlierDate),
        userSavedArticle(userId, arbitraryDoi(), laterDate),
      ],
      getUserListDetails(userId),
    );

    it('returns a count of the articles', () => {
      expect(details.articleCount).toStrictEqual(2);
    });

    it('returns the last updated date', () => {
      expect(details.lastUpdated).toStrictEqual(O.some(laterDate));
    });
  });

  describe('when the list has had articles removed', () => {
    const userId = arbitraryUserId();
    const earlierDate = new Date('1970');
    const laterDate = new Date('2020');
    const articleId = arbitraryDoi();
    const details = pipe(
      [
        userSavedArticle(userId, articleId, earlierDate),
        userUnsavedArticle(userId, articleId, laterDate),
      ],
      getUserListDetails(userId),
    );

    it.skip('returns a count of the remaining articles', () => {
      expect(details.articleCount).toStrictEqual(0);
    });

    it.skip('returns the date of the last activity', () => {
      expect(details.lastUpdated).toStrictEqual(O.some(laterDate));
    });
  });

  describe('when only a different user has saved articles', () => {
    const userId = arbitraryUserId();
    const differentUserId = arbitraryUserId();
    const details = pipe(
      [
        userSavedArticle(differentUserId, arbitraryDoi()),
      ],
      getUserListDetails(userId),
    );

    it('returns a count of 0', () => {
      expect(details.articleCount).toStrictEqual(0);
    });

    it('returns no last updated date', () => {
      expect(details.lastUpdated).toStrictEqual(O.none);
    });
  });
});
