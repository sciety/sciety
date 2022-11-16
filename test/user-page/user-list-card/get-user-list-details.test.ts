import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { userSavedArticle, userUnsavedArticle } from '../../../src/domain-events';
import { listCreated } from '../../../src/domain-events/list-created-event';
import * as LOID from '../../../src/types/list-owner-id';
import { getUserListDetails } from '../../../src/user-page/user-list-card/get-user-list-details';
import { arbitraryString } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('get-user-list-details', () => {
  const userId = arbitraryUserId();
  const listId = arbitraryListId();

  describe('when the list contains no articles', () => {
    const details = pipe(
      [
        listCreated(listId, arbitraryString(), arbitraryString(), LOID.fromUserId(userId)),
      ],
      getUserListDetails(userId),
    );

    it('returns a count of 0', () => {
      expect(details.articleCount).toBe(0);
    });

    it('returns no last updated date', () => {
      expect(details.lastUpdated).toStrictEqual(O.none);
    });

    it.failing('returns a list id', () => {
      expect(details.listId).toStrictEqual(listId);
    });
  });

  describe('when the list contains some articles', () => {
    const earlierDate = new Date('1970');
    const laterDate = new Date('2020');
    const details = pipe(
      [
        listCreated(listId, arbitraryString(), arbitraryString(), LOID.fromUserId(userId)),
        userSavedArticle(userId, arbitraryArticleId(), earlierDate),
        userSavedArticle(userId, arbitraryArticleId(), laterDate),
      ],
      getUserListDetails(userId),
    );

    it('returns a count of the articles', () => {
      expect(details.articleCount).toBe(2);
    });

    it('returns the last updated date', () => {
      expect(details.lastUpdated).toStrictEqual(O.some(laterDate));
    });

    it.failing('returns a list id', () => {
      expect(details.listId).toStrictEqual(listId);
    });
  });

  describe('when the list has had articles removed', () => {
    const earlierDate = new Date('1970');
    const laterDate = new Date('2020');
    const articleId = arbitraryArticleId();
    const details = pipe(
      [
        listCreated(listId, arbitraryString(), arbitraryString(), LOID.fromUserId(userId)),
        userSavedArticle(userId, arbitraryArticleId(), new Date(1950)),
        userSavedArticle(userId, articleId, earlierDate),
        userUnsavedArticle(userId, articleId, laterDate),
      ],
      getUserListDetails(userId),
    );

    it('returns a count of the remaining articles', () => {
      expect(details.articleCount).toBe(1);
    });

    it('returns the date of the last activity', () => {
      expect(details.lastUpdated).toStrictEqual(O.some(laterDate));
    });

    it.failing('returns a list id', () => {
      expect(details.listId).toStrictEqual(listId);
    });
  });

  describe('when only a different user has saved articles', () => {
    const differentUserId = arbitraryUserId();
    const details = pipe(
      [
        listCreated(listId, arbitraryString(), arbitraryString(), LOID.fromUserId(userId)),
        userSavedArticle(differentUserId, arbitraryArticleId()),
      ],
      getUserListDetails(userId),
    );

    it('returns a count of 0', () => {
      expect(details.articleCount).toBe(0);
    });

    it('returns no last updated date', () => {
      expect(details.lastUpdated).toStrictEqual(O.none);
    });

    it.failing('returns a list id', () => {
      expect(details.listId).toStrictEqual(listId);
    });
  });
});
