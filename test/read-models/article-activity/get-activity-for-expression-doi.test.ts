import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent, DomainEvent } from '../../../src/domain-events/index.js';
import { arbitraryArticleId } from '../../types/article-id.helper.js';
import { arbitraryListId } from '../../types/list-id.helper.js';
import { handleEvent, initialState } from '../../../src/read-models/article-activity/handle-event.js';
import * as EDOI from '../../../src/types/expression-doi.js';
import { ArticleId } from '../../../src/types/article-id.js';
import { getActivityForExpressionDoi } from '../../../src/read-models/article-activity/get-activity-for-expression-doi.js';

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
