import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent, DomainEvent } from '../../../src/domain-events';
import { arbitraryEvaluationRecordedEvent } from '../../types/evaluation-recorded-event.helper';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { handleEvent, initialState } from '../../../src/shared-read-models/article-activity/handle-event';
import { getActivityForArticle } from '../../../src/shared-read-models/article-activity/get-activity-for-article';
import { arbitraryEvaluationRemovedByGroupEvent } from '../../types/evaluation-removed-by-group-event-helper';

const runQuery = (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.reduce(initialState(), handleEvent),
  getActivityForArticle,
);

describe('get-activity-for-article', () => {
  const articleId = arbitraryArticleId();

  describe('when an article has no evaluations and is in no list', () => {
    describe('because it has never been added to a list', () => {
      it('article has no activity', () => {
        expect(runQuery([])(articleId)).toStrictEqual({
          articleId,
          latestActivityAt: O.none,
          evaluationCount: 0,
          listMembershipCount: 0,
        });
      });
    });

    describe('because it has been added and removed from a list', () => {
      const listId = arbitraryListId();
      const events = [
        constructEvent('ArticleAddedToList')({ articleId, listId }),
        constructEvent('ArticleRemovedFromList')({ articleId, listId }),
      ];

      it('has a listMemberShipCount of 0', () => {
        expect(runQuery(events)(articleId).listMembershipCount).toBe(0);
      });
    });

    describe('because it has had an evaluation recorded and erased', () => {
      const evaluationRecordedEvent = arbitraryEvaluationRecordedEvent();
      const events = [
        evaluationRecordedEvent,
        constructEvent('IncorrectlyRecordedEvaluationErased')({ evaluationLocator: evaluationRecordedEvent.evaluationLocator }),
      ];

      it('the article has no evaluations', () => {
        expect(runQuery(events)(evaluationRecordedEvent.articleId).evaluationCount).toBe(0);
      });
    });

    describe('because it has had an evaluation recorded and removed', () => {
      const evaluationRecordedEvent = arbitraryEvaluationRecordedEvent();
      const events = [
        evaluationRecordedEvent,
        {
          ...arbitraryEvaluationRemovedByGroupEvent(),
          evaluationLocator: evaluationRecordedEvent.evaluationLocator,
        },
      ];

      it.failing('the article has no evaluations', () => {
        expect(runQuery(events)(evaluationRecordedEvent.articleId).evaluationCount).toBe(0);
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
      const events = [
        event1,
        event2,
      ];

      it('returns the activity for that article', () => {
        expect(runQuery(events)(event1.articleId)).toStrictEqual(expect.objectContaining({
          latestActivityAt: O.some(event2.publishedAt),
          evaluationCount: 2,
        }));
      });
    });

    describe('and the evaluations are NOT recorded in order of publication', () => {
      const events = [
        event2,
        event1,
      ];

      it('returns the activity for that article', () => {
        expect(runQuery(events)(event1.articleId)).toStrictEqual(expect.objectContaining({
          latestActivityAt: O.some(event2.publishedAt),
          evaluationCount: 2,
        }));
      });
    });

    describe('and one of the evaluations has been erased', () => {
      const events = [
        event2,
        event1,
        constructEvent('IncorrectlyRecordedEvaluationErased')({ evaluationLocator: event2.evaluationLocator }),
      ];

      it('the evaluation count reflects the erasure', () => {
        expect(runQuery(events)(event1.articleId).evaluationCount).toBe(1);
      });

      it('the latest activity reflects the erasure', () => {
        expect(runQuery(events)(event1.articleId).latestActivityAt).toStrictEqual(O.some(event1.publishedAt));
      });
    });
  });

  describe('when an article has one evaluation that was recorded twice', () => {
    const event = arbitraryEvaluationRecordedEvent();
    const events = [
      event,
      event,
    ];

    it('the evaluation count is 1', () => {
      expect(runQuery(events)(event.articleId).evaluationCount).toBe(1);
    });

    it('the latest activity is that of the first recording', () => {
      expect(runQuery(events)(event.articleId).latestActivityAt).toStrictEqual(O.some(event.publishedAt));
    });
  });

  describe('when an article appears in one list', () => {
    describe('and the article has been added to a single list and not removed', () => {
      const events = [
        constructEvent('ArticleAddedToList')({ articleId, listId: arbitraryListId() }),
      ];

      it('has a listMemberShipCount of 1', () => {
        expect(runQuery(events)(articleId).listMembershipCount).toBe(1);
      });
    });

    describe('and the article was added and removed from a different list', () => {
      const listAId = arbitraryListId();
      const listBId = arbitraryListId();
      const events = [
        constructEvent('ArticleAddedToList')({ articleId, listId: listAId }),
        constructEvent('ArticleRemovedFromList')({ articleId, listId: listAId }),
        constructEvent('ArticleAddedToList')({ articleId, listId: listBId }),
      ];

      it('has a listMemberShipCount of 1', () => {
        expect(runQuery(events)(articleId).listMembershipCount).toBe(1);
      });
    });

    describe('added to a list, after being evaluated', () => {
      const evaluationRecorded = arbitraryEvaluationRecordedEvent();
      const events = [
        evaluationRecorded,
        constructEvent('ArticleAddedToList')({ articleId: evaluationRecorded.articleId, listId: arbitraryListId() }),
      ];

      it('has a listMemberShipCount of 1', () => {
        expect(runQuery(events)(evaluationRecorded.articleId).listMembershipCount).toBe(1);
      });

      it('has an evaluationCount of 1', () => {
        expect(runQuery(events)(evaluationRecorded.articleId).evaluationCount).toBe(1);
      });
    });
  });

  describe('when an article appears in multiple lists', () => {
    describe('in two different lists', () => {
      const events = [
        constructEvent('ArticleAddedToList')({ articleId, listId: arbitraryListId() }),
        constructEvent('ArticleAddedToList')({ articleId, listId: arbitraryListId() }),
      ];

      it('has a listMemberShipCount of 2', () => {
        expect(runQuery(events)(articleId).listMembershipCount).toBe(2);
      });
    });
  });
});
