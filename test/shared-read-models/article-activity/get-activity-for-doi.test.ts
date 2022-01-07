import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { evaluationRecorded } from '../../../src/domain-events';
import { getActivityForDoi } from '../../../src/shared-read-models/article-activity';
import { arbitraryDate } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('get-activity-for-doi', () => {
  const articleId = arbitraryDoi();

  describe('when an article has no evaluations', () => {
    const articleActivity = pipe(
      [],
      getActivityForDoi(articleId),
    );

    it('article has no activity', () => {
      expect(articleActivity).toStrictEqual({
        doi: articleId,
        latestActivityDate: O.none,
        evaluationCount: 0,
        listMembershipCount: 0,
      });
    });
  });

  describe('when an article has one or more evaluations', () => {
    const earlierPublishedDate = new Date(1900);
    const laterPublishedDate = new Date(2000);

    describe('and the evaluations are recorded in order of publication', () => {
      const articleActivity = pipe(
        [
          evaluationRecorded(
            arbitraryGroupId(),
            articleId,
            arbitraryReviewId(),
            [],
            earlierPublishedDate,
            arbitraryDate(),
          ),
          evaluationRecorded(
            arbitraryGroupId(),
            articleId,
            arbitraryReviewId(),
            [],
            laterPublishedDate,
            arbitraryDate(),
          ),
        ],
        getActivityForDoi(articleId),
      );

      it('returns the activity for that article', () => {
        expect(articleActivity).toStrictEqual(expect.objectContaining({
          latestActivityDate: O.some(laterPublishedDate),
          evaluationCount: 2,
        }));
      });
    });

    describe('and the evaluations are NOT recorded in order of publication', () => {
      const articleActivity = pipe(
        [
          evaluationRecorded(
            arbitraryGroupId(),
            articleId,
            arbitraryReviewId(),
            [],
            laterPublishedDate,
            arbitraryDate(),
          ),
          evaluationRecorded(
            arbitraryGroupId(),
            articleId,
            arbitraryReviewId(),
            [],
            earlierPublishedDate,
            arbitraryDate(),
          ),
        ],
        getActivityForDoi(articleId),
      );

      it('returns the activity for that article', () => {
        expect(articleActivity).toStrictEqual(expect.objectContaining({
          latestActivityDate: O.some(laterPublishedDate),
          evaluationCount: 2,
        }));
      });
    });
  });

  describe('when an article appears in one list', () => {
    describe('and the list is Evaluated Articles list', () => {
      const groupId = arbitraryGroupId();
      const articleActivity = pipe(
        [
          evaluationRecorded(groupId, articleId, arbitraryReviewId()),
          evaluationRecorded(groupId, articleId, arbitraryReviewId()),
        ],
        getActivityForDoi(articleId),
      );

      it('has a listMemberShipCount of 1', () => {
        expect(articleActivity.listMembershipCount).toBe(1);
      });
    });

    describe('and the list is a featured articles list', () => {
      it.todo('has a listMemberShipCount of 1');
    });

    describe('and the list is user list', () => {
      it.todo('has a listMemberShipCount of 1');
    });
  });

  describe('when an article appears in multiple lists', () => {
    describe('and the lists are Evaluated Articles lists', () => {
      const articleActivity = pipe(
        [
          evaluationRecorded(arbitraryGroupId(), articleId, arbitraryReviewId()),
          evaluationRecorded(arbitraryGroupId(), articleId, arbitraryReviewId()),
        ],
        getActivityForDoi(articleId),
      );

      it('has a listMemberShipCount of 2', () => {
        expect(articleActivity.listMembershipCount).toBe(2);
      });
    });
  });

  describe('when an article does not appear in any list', () => {
    describe('because it was never added to a list', () => {
      const articleActivity = pipe(
        [],
        getActivityForDoi(articleId),
      );

      it('has a listMemberShipCount of 0', () => {
        expect(articleActivity.listMembershipCount).toBe(0);
      });
    });

    describe('because it has been Saved and Unsaved in a user list', () => {
      it.todo('has a listMemberShipCount of 0');
    });
  });
});
