import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { constructEvent, DomainEvent } from '../../../src/domain-events';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../domain-events/evaluation-resource-events.helper';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { handleEvent, initialState } from '../../../src/read-models/article-activity/handle-event';
import { arbitraryDate } from '../../helpers';
import * as EDOI from '../../../src/types/expression-doi';
import { ArticleId } from '../../../src/types/article-id';
import { getActivityForExpressionDoi } from '../../../src/read-models/article-activity/get-activity-for-expression-doi';

const runQuery = (events: ReadonlyArray<DomainEvent>) => (articleId: ArticleId) => pipe(
  events,
  RA.reduce(initialState(), handleEvent),
  getActivityForExpressionDoi,
)(EDOI.fromValidatedString(articleId.value));

describe('get-activity-for-expression-doi', () => {
  const articleId = arbitraryArticleId();

  describe('when an article has never been added to a list', () => {
    it('article has no activity', () => {
      expect(runQuery([])(articleId)).toStrictEqual({
        expressionDoi: articleId,
        latestActivityAt: O.none,
        listMembershipCount: 0,
      });
    });
  });

  describe('when an article has been added and removed from a list', () => {
    const listId = arbitraryListId();
    const events = [
      constructEvent('ArticleAddedToList')({ articleId, listId }),
      constructEvent('ArticleRemovedFromList')({ articleId, listId }),
    ];

    it('has a listMemberShipCount of 0', () => {
      expect(runQuery(events)(articleId).listMembershipCount).toBe(0);
    });
  });

  describe('when an article has two evaluations, recorded in order of publication', () => {
    const earlierPublishedAt = arbitraryDate();
    const laterPublishedAt = new Date(earlierPublishedAt.getTime() + 1000);
    const events = [
      {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        articleId,
        publishedAt: earlierPublishedAt,
      },
      {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        articleId,
        publishedAt: laterPublishedAt,
      },
    ];

    it('has latestActivityAt set to the most recent publication date', () => {
      expect(runQuery(events)(articleId)).toStrictEqual(expect.objectContaining({
        latestActivityAt: O.some(laterPublishedAt),
      }));
    });
  });

  describe('when an article has two evaluations, not recorded in order of publication', () => {
    const earlierPublishedAt = arbitraryDate();
    const laterPublishedAt = new Date(earlierPublishedAt.getTime() + 1000);
    const events = [
      {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        articleId,
        publishedAt: laterPublishedAt,
      },
      {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        articleId,
        publishedAt: earlierPublishedAt,
      },
    ];

    it('has latestActivityAt set to the most recent publication date', () => {
      expect(runQuery(events)(articleId)).toStrictEqual(expect.objectContaining({
        latestActivityAt: O.some(laterPublishedAt),
      }));
    });
  });

  describe('when an article has two evaluation publications recorded, and one of the evaluations erased', () => {
    const earlierPublishedAt = arbitraryDate();
    const laterPublishedAt = new Date(earlierPublishedAt.getTime() + 1000);
    const evaluationLocator = arbitraryEvaluationLocator();
    const events = [
      {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        articleId,
        publishedAt: laterPublishedAt,
        evaluationLocator,
      },
      {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        articleId,
        publishedAt: earlierPublishedAt,
      },
      constructEvent('IncorrectlyRecordedEvaluationErased')({ evaluationLocator }),
    ];

    it('has latestActivity set to the previous publication date', () => {
      expect(runQuery(events)(articleId).latestActivityAt).toStrictEqual(O.some(earlierPublishedAt));
    });
  });

  describe('when an article has one evaluation that was recorded twice', () => {
    const event = arbitraryEvaluationPublicationRecordedEvent();
    const events = [
      event,
      event,
    ];

    it('has latestActivity set to the first recorded publication date', () => {
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
      const evaluationRecorded = arbitraryEvaluationPublicationRecordedEvent();
      const events = [
        evaluationRecorded,
        constructEvent('ArticleAddedToList')({ articleId: evaluationRecorded.articleId, listId: arbitraryListId() }),
      ];

      it('has a listMemberShipCount of 1', () => {
        expect(runQuery(events)(evaluationRecorded.articleId).listMembershipCount).toBe(1);
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
