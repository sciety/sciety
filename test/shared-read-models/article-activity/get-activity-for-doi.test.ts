import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  articleAddedToList, articleRemovedFromList, evaluationRecorded,
} from '../../../src/domain-events';
import { userSavedArticle } from '../../../src/domain-events/user-saved-article-event';
import { arbitraryDate } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';
import { handleEvent, initialState } from '../../../src/shared-read-models/article-activity';
import { getActivityForDoi } from '../../../src/shared-read-models/article-activity/get-activity-for-doi';

describe('get-activity-for-doi', () => {
  const articleId = arbitraryArticleId();

  describe('when an article has no evaluations and is in no list', () => {
    describe('because it has never been added to a list', () => {
      const readmodel = pipe(
        [],
        RA.reduce(initialState(), handleEvent),
      );

      it('article has no activity', () => {
        expect(getActivityForDoi(readmodel)(articleId)).toStrictEqual({
          articleId,
          latestActivityDate: O.none,
          evaluationCount: 0,
          listMembershipCount: 0,
        });
      });
    });

    describe('because it has been added and removed from a list', () => {
      const listId = arbitraryListId();
      const readmodel = pipe(
        [
          articleAddedToList(articleId, listId),
          articleRemovedFromList(articleId, listId),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('has a listMemberShipCount of 0', () => {
        expect(getActivityForDoi(readmodel)(articleId).listMembershipCount).toBe(0);
      });
    });

    describe('because it has had an evaluation recorded and erased', () => {
      it.todo('article has no activity');
    });
  });

  describe('when an article has one or more evaluations', () => {
    const earlierPublishedDate = new Date(1900);
    const laterPublishedDate = new Date(2000);

    describe('and the evaluations are recorded in order of publication', () => {
      const readmodel = pipe(
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
        RA.reduce(initialState(), handleEvent),
      );

      it('returns the activity for that article', () => {
        expect(getActivityForDoi(readmodel)(articleId)).toStrictEqual(expect.objectContaining({
          latestActivityDate: O.some(laterPublishedDate),
          evaluationCount: 2,
        }));
      });
    });

    describe('and the evaluations are NOT recorded in order of publication', () => {
      const readmodel = pipe(
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
        RA.reduce(initialState(), handleEvent),
      );

      it('returns the activity for that article', () => {
        expect(getActivityForDoi(readmodel)(articleId)).toStrictEqual(expect.objectContaining({
          latestActivityDate: O.some(laterPublishedDate),
          evaluationCount: 2,
        }));
      });
    });

    describe('and one of the evaluations has been erased', () => {
      it.todo('the evaluation count reflects the erasure');
    });
  });

  describe('when an article appears in one list', () => {
    describe('and the article has been added to a single list and not removed', () => {
      const readmodel = pipe(
        [
          articleAddedToList(articleId, arbitraryListId()),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('has a listMemberShipCount of 1', () => {
        expect(getActivityForDoi(readmodel)(articleId).listMembershipCount).toBe(1);
      });
    });

    describe('and the article was added and removed from a different list', () => {
      const listAId = arbitraryListId();
      const listBId = arbitraryListId();
      const readmodel = pipe(
        [
          articleAddedToList(articleId, listAId),
          articleRemovedFromList(articleId, listAId),
          articleAddedToList(articleId, listBId),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('has a listMemberShipCount of 1', () => {
        expect(getActivityForDoi(readmodel)(articleId).listMembershipCount).toBe(1);
      });
    });

    describe('and the article was saved by a user with a legacy command', () => {
      const readmodel = pipe(
        [
          userSavedArticle(arbitraryUserId(), articleId),
          articleAddedToList(articleId, arbitraryListId()),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('has a listMemberShipCount of 1', () => {
        expect(getActivityForDoi(readmodel)(articleId).listMembershipCount).toBe(1);
      });
    });

    describe('added to a list, after being evaluated', () => {
      const readmodel = pipe(
        [
          evaluationRecorded(arbitraryGroupId(), articleId, arbitraryReviewId(), [], arbitraryDate()),
          articleAddedToList(articleId, arbitraryListId()),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('has a listMemberShipCount of 1', () => {
        expect(getActivityForDoi(readmodel)(articleId).listMembershipCount).toBe(1);
      });

      it('has an evaluationCount of 1', () => {
        expect(getActivityForDoi(readmodel)(articleId).evaluationCount).toBe(1);
      });
    });
  });

  describe('when an article appears in multiple lists', () => {
    describe('in two different lists', () => {
      const readmodel = pipe(
        [
          articleAddedToList(articleId, arbitraryListId()),
          articleAddedToList(articleId, arbitraryListId()),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('has a listMemberShipCount of 2', () => {
        expect(getActivityForDoi(readmodel)(articleId).listMembershipCount).toBe(2);
      });
    });
  });
});
