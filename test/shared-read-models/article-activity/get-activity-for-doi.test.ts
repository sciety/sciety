import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import {
  articleAddedToList, evaluationRecorded, userSavedArticle, userUnsavedArticle,
} from '../../../src/domain-events';
import { getActivityForDoi } from '../../../src/shared-read-models/article-activity';
import { Doi } from '../../../src/types/doi';
import { arbitraryDate } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('get-activity-for-doi', () => {
  const articleId = arbitraryDoi();
  const articleIdFromNcrcHighInterestList = new Doi('10.1101/2021.08.30.21262866');

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
      const articleActivity = pipe(
        [
          articleAddedToList(articleId, arbitraryListId()),
        ],
        getActivityForDoi(articleId),
      );

      it.skip('has a listMemberShipCount of 1', () => {
        expect(articleActivity.listMembershipCount).toBe(1);
      });
    });

    describe('and the list is a featured articles list and it was saved and unsaved by a user', () => {
      const userId = arbitraryUserId();
      const articleActivity = pipe(
        [
          userSavedArticle(userId, articleIdFromNcrcHighInterestList),
          userUnsavedArticle(userId, articleIdFromNcrcHighInterestList),
        ],
        getActivityForDoi(articleIdFromNcrcHighInterestList),
      );

      it('has a listMemberShipCount of 1', () => {
        expect(articleActivity.listMembershipCount).toBe(1);
      });
    });

    describe('and the list is user list', () => {
      const articleActivity = pipe(
        [
          userSavedArticle(arbitraryUserId(), articleId),
        ],
        getActivityForDoi(articleId),
      );

      it('has a listMemberShipCount of 1', () => {
        expect(articleActivity.listMembershipCount).toBe(1);
      });
    });
  });

  describe('when an article appears in multiple lists', () => {
    describe('first in a group list and then in a user list', () => {
      const articleActivity = pipe(
        [
          evaluationRecorded(arbitraryGroupId(), articleId, arbitraryReviewId()),
          userSavedArticle(arbitraryUserId(), articleId),
        ],
        getActivityForDoi(articleId),
      );

      it('has a listMemberShipCount of 2', () => {
        expect(articleActivity.listMembershipCount).toBe(2);
      });
    });

    describe('first in a group list and then in a featured articles list', () => {
      const articleActivity = pipe(
        [
          evaluationRecorded(arbitraryGroupId(), articleIdFromNcrcHighInterestList, arbitraryReviewId()),
          evaluationRecorded(arbitraryGroupId(), articleIdFromNcrcHighInterestList, arbitraryReviewId()),
        ],
        getActivityForDoi(articleIdFromNcrcHighInterestList),
      );

      it('has a listMemberShipCount of 3', () => {
        expect(articleActivity.listMembershipCount).toBe(3);
      });
    });

    describe('first in a user list and then in a group list', () => {
      const articleActivity = pipe(
        [
          userSavedArticle(arbitraryUserId(), articleId),
          evaluationRecorded(arbitraryGroupId(), articleId, arbitraryReviewId()),
        ],
        getActivityForDoi(articleId),
      );

      it('has a listMemberShipCount of 2', () => {
        expect(articleActivity.listMembershipCount).toBe(2);
      });
    });

    describe('first in a user list and then in a featured articles list', () => {
      const articleActivity = pipe(
        [
          userSavedArticle(arbitraryUserId(), articleIdFromNcrcHighInterestList),
        ],
        getActivityForDoi(articleIdFromNcrcHighInterestList),
      );

      it('has a listMemberShipCount of 2', () => {
        expect(articleActivity.listMembershipCount).toBe(2);
      });
    });

    describe('first in two user lists and then in a featured articles list', () => {
      const articleActivity = pipe(
        [
          userSavedArticle(arbitraryUserId(), articleIdFromNcrcHighInterestList),
          userSavedArticle(arbitraryUserId(), articleIdFromNcrcHighInterestList),
        ],
        getActivityForDoi(articleIdFromNcrcHighInterestList),
      );

      it('has a listMemberShipCount of 3', () => {
        expect(articleActivity.listMembershipCount).toBe(3);
      });
    });

    describe('multiple lists from different users', () => {
      const articleActivity = pipe(
        [
          userSavedArticle(arbitraryUserId(), articleId),
          userSavedArticle(arbitraryUserId(), articleId),
        ],
        getActivityForDoi(articleId),
      );

      it('has a listMemberShipCount of 2', () => {
        expect(articleActivity.listMembershipCount).toBe(2);
      });
    });

    describe('multiple lists from different groups', () => {
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
      const userId = arbitraryUserId();
      const articleActivity = pipe(
        [
          userSavedArticle(userId, articleId),
          userUnsavedArticle(userId, articleId),
        ],
        getActivityForDoi(articleId),
      );

      it('has a listMemberShipCount of 0', () => {
        expect(articleActivity.listMembershipCount).toBe(0);
      });
    });
  });
});
