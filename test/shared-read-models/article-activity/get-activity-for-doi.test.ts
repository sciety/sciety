import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events';
import { arbitraryEvaluationRecordedEvent } from '../../types/evaluation-recorded-event.helper';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { handleEvent, initialState } from '../../../src/shared-read-models/article-activity/handle-event';
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
          latestActivityAt: O.none,
          evaluationCount: 0,
          listMembershipCount: 0,
        });
      });
    });

    describe('because it has been added and removed from a list', () => {
      const listId = arbitraryListId();
      const readmodel = pipe(
        [
          constructEvent('ArticleAddedToList')({ articleId, listId }),
          constructEvent('ArticleRemovedFromList')({ articleId, listId }),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('has a listMemberShipCount of 0', () => {
        expect(getActivityForDoi(readmodel)(articleId).listMembershipCount).toBe(0);
      });
    });

    describe('because it has had an evaluation recorded and erased', () => {
      const evaluationRecordedEvent = arbitraryEvaluationRecordedEvent();
      const readmodel = pipe(
        [
          evaluationRecordedEvent,
          constructEvent('IncorrectlyRecordedEvaluationErased')({ evaluationLocator: evaluationRecordedEvent.evaluationLocator }),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('the article has no evaluations', () => {
        expect(getActivityForDoi(readmodel)(evaluationRecordedEvent.articleId).evaluationCount).toBe(0);
      });
    });
  });

  describe('when an article has one or more evaluations', () => {
    const event1 = arbitraryEvaluationRecordedEvent();
    const event2 = {
      ...arbitraryEvaluationRecordedEvent(),
      articleId: event1.articleId,
      publishedAt: new Date(event1.publishedAt.getTime() + 1000),
    };

    describe('and the evaluations are recorded in order of publication', () => {
      const readmodel = pipe(
        [
          event1,
          event2,
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('returns the activity for that article', () => {
        expect(getActivityForDoi(readmodel)(event1.articleId)).toStrictEqual(expect.objectContaining({
          latestActivityAt: O.some(event2.publishedAt),
          evaluationCount: 2,
        }));
      });
    });

    describe('and the evaluations are NOT recorded in order of publication', () => {
      const readmodel = pipe(
        [
          event2,
          event1,
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('returns the activity for that article', () => {
        expect(getActivityForDoi(readmodel)(event1.articleId)).toStrictEqual(expect.objectContaining({
          latestActivityAt: O.some(event2.publishedAt),
          evaluationCount: 2,
        }));
      });
    });

    describe('and one of the evaluations has been erased', () => {
      const readmodel = pipe(
        [
          event2,
          event1,
          constructEvent('IncorrectlyRecordedEvaluationErased')({ evaluationLocator: event2.evaluationLocator }),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('the evaluation count reflects the erasure', () => {
        expect(getActivityForDoi(readmodel)(event1.articleId).evaluationCount).toBe(1);
      });

      it('the latest activity reflects the erasure', () => {
        expect(
          getActivityForDoi(readmodel)(event1.articleId).latestActivityAt,
        ).toStrictEqual(O.some(event1.publishedAt));
      });
    });
  });

  describe('when an article has one evaluation that was recorded twice', () => {
    const event = arbitraryEvaluationRecordedEvent();
    const readmodel = pipe(
      [
        event,
        event,
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('the evaluation count is 1', () => {
      expect(getActivityForDoi(readmodel)(event.articleId).evaluationCount).toBe(1);
    });

    it('the latest activity is that of the first recording', () => {
      expect(getActivityForDoi(readmodel)(event.articleId).latestActivityAt).toStrictEqual(O.some(event.publishedAt));
    });
  });

  describe('when an article appears in one list', () => {
    describe('and the article has been added to a single list and not removed', () => {
      const readmodel = pipe(
        [
          constructEvent('ArticleAddedToList')({ articleId, listId: arbitraryListId() }),
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
          constructEvent('ArticleAddedToList')({ articleId, listId: listAId }),
          constructEvent('ArticleRemovedFromList')({ articleId, listId: listAId }),
          constructEvent('ArticleAddedToList')({ articleId, listId: listBId }),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('has a listMemberShipCount of 1', () => {
        expect(getActivityForDoi(readmodel)(articleId).listMembershipCount).toBe(1);
      });
    });

    describe('added to a list, after being evaluated', () => {
      const evaluationRecorded = arbitraryEvaluationRecordedEvent();
      const readmodel = pipe(
        [
          evaluationRecorded,
          constructEvent('ArticleAddedToList')({ articleId: evaluationRecorded.articleId, listId: arbitraryListId() }),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('has a listMemberShipCount of 1', () => {
        expect(getActivityForDoi(readmodel)(evaluationRecorded.articleId).listMembershipCount).toBe(1);
      });

      it('has an evaluationCount of 1', () => {
        expect(getActivityForDoi(readmodel)(evaluationRecorded.articleId).evaluationCount).toBe(1);
      });
    });
  });

  describe('when an article appears in multiple lists', () => {
    describe('in two different lists', () => {
      const readmodel = pipe(
        [
          constructEvent('ArticleAddedToList')({ articleId, listId: arbitraryListId() }),
          constructEvent('ArticleAddedToList')({ articleId, listId: arbitraryListId() }),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('has a listMemberShipCount of 2', () => {
        expect(getActivityForDoi(readmodel)(articleId).listMembershipCount).toBe(2);
      });
    });
  });
});
