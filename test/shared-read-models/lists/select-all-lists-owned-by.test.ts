import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { groupEvaluatedArticle } from '../../../src/domain-events';
import { List, selectAllListsOwnedBy } from '../../../src/shared-read-models/lists';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('select-all-lists-owned-by', () => {
  const group = arbitraryGroup();
  const groupId = group.id;

  describe('common properties', () => {
    let result: List;

    beforeEach(() => {
      result = pipe(
        [],
        selectAllListsOwnedBy(group.id),
      );
    });

    it('returns the list name', () => {
      expect(result.name).not.toBeNull();
    });

    it('returns the list description', () => {
      expect(result.description).not.toBeNull();
    });
  });

  describe('when the list contains no articles', () => {
    let result: List;

    beforeEach(() => {
      result = pipe(
        [],
        selectAllListsOwnedBy(group.id),
      );
    });

    it('returns a count of 0', () => {
      expect(result.articleCount).toBe(0);
    });

    it('returns no last updated date', () => {
      expect(result.lastUpdated).toStrictEqual(O.none);
    });
  });

  describe('when the list contains some articles', () => {
    const newerDate = new Date('2021-07-08');
    let result: List;

    beforeEach(() => {
      result = pipe(
        [
          groupEvaluatedArticle(groupId, arbitraryDoi(), arbitraryReviewId()),
          groupEvaluatedArticle(groupId, arbitraryDoi(), arbitraryReviewId(), newerDate),
        ],
        selectAllListsOwnedBy(group.id),
      );
    });

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
    let result: List;

    beforeEach(() => {
      result = pipe(
        [
          groupEvaluatedArticle(groupId, articleId, arbitraryReviewId()),
          groupEvaluatedArticle(groupId, articleId, arbitraryReviewId(), newerDate),
        ],
        selectAllListsOwnedBy(group.id),
      );
    });

    it('returns a count of 1', () => {
      expect(result.articleCount).toBe(1);
    });

    it('returns the last updated date', () => {
      expect(result.lastUpdated).toStrictEqual(O.some(newerDate));
    });
  });

  describe('when a list with a different owner contains some articles', () => {
    let result: List;

    beforeEach(() => {
      result = pipe(
        [
          groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
        ],
        selectAllListsOwnedBy(group.id),
      );
    });

    it('returns a count of 0', () => {
      expect(result.articleCount).toBe(0);
    });

    it('returns no last updated date', () => {
      expect(result.lastUpdated).toStrictEqual(O.none);
    });
  });
});
