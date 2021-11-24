import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DomainEvent, groupEvaluatedArticle } from '../../src/domain-events';
import { allLists, List } from '../../src/shared-read-models/all-lists';
import { GroupId } from '../../src/types/group-id';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryGroup } from '../types/group.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

const callGroupListWith = async (groupId: GroupId, events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  allLists,
  (readModel) => readModel(groupId),
  TE.getOrElse(shouldNotBeCalled),
)();

describe('all-lists', () => {
  const group = arbitraryGroup();
  const groupId = group.id;

  describe('common properties', () => {
    let result: List;

    beforeEach(async () => {
      result = await callGroupListWith(group.id, []);
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

    beforeEach(async () => {
      result = await callGroupListWith(group.id, []);
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

    beforeEach(async () => {
      result = await callGroupListWith(group.id, [
        groupEvaluatedArticle(groupId, arbitraryDoi(), arbitraryReviewId()),
        groupEvaluatedArticle(groupId, arbitraryDoi(), arbitraryReviewId(), newerDate),
      ]);
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

    beforeEach(async () => {
      result = await callGroupListWith(group.id, [
        groupEvaluatedArticle(groupId, articleId, arbitraryReviewId()),
        groupEvaluatedArticle(groupId, articleId, arbitraryReviewId(), newerDate),
      ]);
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

    beforeEach(async () => {
      result = await callGroupListWith(group.id, [
        groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
      ]);
    });

    it('returns a count of 0', () => {
      expect(result.articleCount).toBe(0);
    });

    it('returns no last updated date', () => {
      expect(result.lastUpdated).toStrictEqual(O.none);
    });
  });
});
