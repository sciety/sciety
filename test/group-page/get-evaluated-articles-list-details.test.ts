import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { getEvaluatedArticlesListDetails } from '../../src/group-page/get-evaluated-articles-list-details';
import { editorialCommunityReviewedArticle } from '../../src/types/domain-events';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('get-evaluated-articles-list-details', () => {
  const groupId = arbitraryGroupId();

  describe('when the group has evaluated no articles', () => {
    const result = pipe(
      [],
      getEvaluatedArticlesListDetails(groupId),
    );

    it('returns a count of 0', () => {
      expect(result.articleCount).toStrictEqual(0);
    });

    it('returns no last updated date', () => {
      expect(result.lastUpdated).toStrictEqual(O.none);
    });
  });

  describe('when the group has evaluated some articles', () => {
    const newerDate = new Date('2021-07-08');
    const result = pipe(
      [
        editorialCommunityReviewedArticle(groupId, arbitraryDoi(), arbitraryReviewId()),
        editorialCommunityReviewedArticle(groupId, arbitraryDoi(), arbitraryReviewId(), newerDate),
      ],
      getEvaluatedArticlesListDetails(groupId),
    );

    it('returns a count of the articles', () => {
      expect(result.articleCount).toStrictEqual(2);
    });

    it('returns the last updated date', () => {
      expect(result.lastUpdated).toStrictEqual(O.some(newerDate));
    });
  });

  describe('when the group has evaluated one article more than once', () => {
    const articleId = arbitraryDoi();
    const result = pipe(
      [
        editorialCommunityReviewedArticle(groupId, articleId, arbitraryReviewId()),
        editorialCommunityReviewedArticle(groupId, articleId, arbitraryReviewId()),
      ],
      getEvaluatedArticlesListDetails(groupId),
    );

    it('returns a count of 1', () => {
      expect(result.articleCount).toStrictEqual(1);
    });

    it.todo('returns the last updated date');
  });

  describe('when a different group has evaluated some articles', () => {
    const result = pipe(
      [
        editorialCommunityReviewedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
      ],
      getEvaluatedArticlesListDetails(groupId),
    );

    it('returns a count of 0', () => {
      expect(result.articleCount).toStrictEqual(0);
    });

    it('returns no last updated date', () => {
      expect(result.lastUpdated).toStrictEqual(O.none);
    });
  });
});
