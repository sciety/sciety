import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { groupEvaluatedArticle } from '../../src/domain-events';
import { groupList, ListDetails } from '../../src/shared-read-models/group-list';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('group-list', () => {
  const groupId = arbitraryGroupId();

  describe('when the list owner exists', () => {
    describe('common properties', () => {
      let result: ListDetails;

      beforeEach(async () => {
        result = await pipe(
          [],
          groupList(groupId),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('returns the list name', () => {
        expect(result.name).not.toBeNull();
      });

      it.todo('returns the list description');

      it.todo('returns the owner name');

      it.todo('returns the owner avatar path');

      it.todo('returns the owner href');
    });

    describe('when the list contains no articles', () => {
      let result: ListDetails;

      beforeEach(async () => {
        result = await pipe(
          [],
          groupList(groupId),
          TE.getOrElse(shouldNotBeCalled),
        )();
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
      let result: ListDetails;

      beforeEach(async () => {
        result = await pipe(
          [
            groupEvaluatedArticle(groupId, arbitraryDoi(), arbitraryReviewId()),
            groupEvaluatedArticle(groupId, arbitraryDoi(), arbitraryReviewId(), newerDate),
          ],
          groupList(groupId),
          TE.getOrElse(shouldNotBeCalled),
        )();
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
      let result: ListDetails;

      beforeEach(async () => {
        result = await pipe(
          [
            groupEvaluatedArticle(groupId, articleId, arbitraryReviewId()),
            groupEvaluatedArticle(groupId, articleId, arbitraryReviewId(), newerDate),
          ],
          groupList(groupId),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('returns a count of 1', () => {
        expect(result.articleCount).toBe(1);
      });

      it('returns the last updated date', () => {
        expect(result.lastUpdated).toStrictEqual(O.some(newerDate));
      });
    });

    describe('when a list with a different owner contains some articles', () => {
      let result: ListDetails;

      beforeEach(async () => {
        result = await pipe(
          [
            groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
          ],
          groupList(groupId),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('returns a count of 0', () => {
        expect(result.articleCount).toBe(0);
      });

      it('returns no last updated date', () => {
        expect(result.lastUpdated).toStrictEqual(O.none);
      });
    });

    describe('when the list owner does not exist', () => {
      it.todo('returns not found');
    });
  });
});
