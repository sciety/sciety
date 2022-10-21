import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import {
  articleAddedToList, articleRemovedFromList, evaluationRecorded,
} from '../../../src/domain-events';
import { userSavedArticle } from '../../../src/domain-events/user-saved-article-event';
import { getActivityForDoi } from '../../../src/shared-read-models/article-activity';
import { arbitraryDate } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('get-activity-for-doi', () => {
  const articleId = arbitraryArticleId();

  describe('when an article has no evaluations and is in no list', () => {
    describe('because it has never been added to a generic list', () => {
      const articleActivity = pipe(
        [],
        getActivityForDoi(articleId),
      );

      it('article has no activity', () => {
        expect(articleActivity).toStrictEqual({
          articleId,
          latestActivityDate: O.none,
          evaluationCount: 0,
          listMembershipCount: 0,
        });
      });
    });

    describe('because it has been added and removed from a generic list', () => {
      const listId = arbitraryListId();
      const articleActivity = pipe(
        [
          articleAddedToList(articleId, listId),
          articleRemovedFromList(articleId, listId),
        ],
        getActivityForDoi(articleId),
      );

      it.failing('has a listMemberShipCount of 0', () => {
        expect(articleActivity.listMembershipCount).toBe(0);
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

  describe('when an article appears in one generic list', () => {
    describe('and the article has been added to a single generic list and not removed', () => {
      const articleActivity = pipe(
        [
          articleAddedToList(articleId, arbitraryListId()),
        ],
        getActivityForDoi(articleId),
      );

      it('has a listMemberShipCount of 1', () => {
        expect(articleActivity.listMembershipCount).toBe(1);
      });
    });

    describe('and the article was added and removed from a different generic list', () => {
      const listAId = arbitraryListId();
      const listBId = arbitraryListId();
      const articleActivity = pipe(
        [
          articleAddedToList(articleId, listAId),
          articleRemovedFromList(articleId, listAId),
          articleAddedToList(articleId, listBId),
        ],
        getActivityForDoi(articleId),
      );

      it.failing('has a listMemberShipCount of 1', () => {
        expect(articleActivity.listMembershipCount).toBe(1);
      });
    });

    describe('and the article was saved by a user with a legacy command', () => {
      const articleActivity = pipe(
        [
          userSavedArticle(arbitraryUserId(), articleId),
          articleAddedToList(articleId, arbitraryListId()),
        ],
        getActivityForDoi(articleId),
      );

      it.failing('has a listMemberShipCount of 1', () => {
        expect(articleActivity.listMembershipCount).toBe(1);
      });
    });

    describe('added to a generic list, after being evaluated', () => {
      const articleActivity = pipe(
        [
          evaluationRecorded(arbitraryGroupId(), articleId, arbitraryReviewId()),
          articleAddedToList(articleId, arbitraryListId()),
        ],
        getActivityForDoi(articleId),
      );

      it('has a listMemberShipCount of 1', () => {
        expect(articleActivity.listMembershipCount).toBe(1);
      });

      it('has an evaluationCount of 1', () => {
        expect(articleActivity.evaluationCount).toBe(1);
      });
    });
  });

  describe('when an article appears in multiple lists', () => {
    describe('in two different generic lists', () => {
      const articleActivity = pipe(
        [
          articleAddedToList(articleId, arbitraryListId()),
          articleAddedToList(articleId, arbitraryListId()),
        ],
        getActivityForDoi(articleId),
      );

      it('has a listMemberShipCount of 2', () => {
        expect(articleActivity.listMembershipCount).toBe(2);
      });
    });
  });
});
