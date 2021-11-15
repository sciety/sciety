import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { groupEvaluatedArticle } from '../../src/domain-events';
import { groupList } from '../../src/shared-read-models/group-list';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('group-list', () => {
  const groupId = arbitraryGroupId();

  describe('when the group has evaluated no articles', () => {
    const result = pipe(
      [],
      groupList(groupId),
    );

    it('returns a count of 0', () => {
      expect(result.articleCount).toBe(0);
    });

    it('returns no last updated date', () => {
      expect(result.lastUpdated).toStrictEqual(O.none);
    });
  });

  describe('when the group has evaluated some articles', () => {
    const newerDate = new Date('2021-07-08');
    const result = pipe(
      [
        groupEvaluatedArticle(groupId, arbitraryDoi(), arbitraryReviewId()),
        groupEvaluatedArticle(groupId, arbitraryDoi(), arbitraryReviewId(), newerDate),
      ],
      groupList(groupId),
    );

    it('returns a count of the articles', () => {
      expect(result.articleCount).toBe(2);
    });

    it('returns the last updated date', () => {
      expect(result.lastUpdated).toStrictEqual(O.some(newerDate));
    });
  });

  describe('when the group has evaluated one article more than once', () => {
    const newerDate = new Date('2021-07-08');
    const articleId = arbitraryDoi();
    const result = pipe(
      [
        groupEvaluatedArticle(groupId, articleId, arbitraryReviewId()),
        groupEvaluatedArticle(groupId, articleId, arbitraryReviewId(), newerDate),
      ],
      groupList(groupId),
    );

    it('returns a count of 1', () => {
      expect(result.articleCount).toBe(1);
    });

    it('returns the last updated date', () => {
      expect(result.lastUpdated).toStrictEqual(O.some(newerDate));
    });
  });

  describe('when a different group has evaluated some articles', () => {
    const result = pipe(
      [
        groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
      ],
      groupList(groupId),
    );

    it('returns a count of 0', () => {
      expect(result.articleCount).toBe(0);
    });

    it('returns no last updated date', () => {
      expect(result.lastUpdated).toStrictEqual(O.none);
    });
  });
});
