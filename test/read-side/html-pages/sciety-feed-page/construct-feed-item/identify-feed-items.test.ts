import * as E from 'fp-ts/Either';
import { identity, pipe } from 'fp-ts/function';
import { constructEvent } from '../../../../../src/domain-events';
import { identifyFeedItems } from '../../../../../src/read-side/html-pages/sciety-feed-page/construct-view-model/identify-feed-items';
import { ArticleId } from '../../../../../src/types/article-id';
import { abortTest } from '../../../../abort-test';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../../../types/expression-doi.helper';
import { arbitraryListId } from '../../../../types/list-id.helper';

describe('identify-feed-items', () => {
  describe('when a single article is added to a list', () => {
    const events = [
      constructEvent('ArticleAddedToList')({ articleId: new ArticleId(arbitraryExpressionDoi()), listId: arbitraryListId() }),
    ];
    const result = pipe(
      events,
      identifyFeedItems(20, 1),
      E.match(shouldNotBeCalled, identity),
      (pageOfItems) => pageOfItems.items,
    );

    it('returns it unchanged', () => {
      expect(result).toStrictEqual(events);
    });
  });

  describe('given two consecutive events adding articles to the same list', () => {
    const listId = arbitraryListId();
    const earlierDate = new Date('2022-10-18');
    const laterDate = new Date('2022-10-19');

    const result = pipe(
      [
        constructEvent('ArticleAddedToList')({ articleId: new ArticleId(arbitraryExpressionDoi()), listId, date: earlierDate }),
        constructEvent('ArticleAddedToList')({ articleId: new ArticleId(arbitraryExpressionDoi()), listId, date: laterDate }),
      ],
      identifyFeedItems(20, 1),
      E.getOrElseW(abortTest('identifyFeedItems returned on the Left')),
      (pageOfItems) => pageOfItems.items,
    );

    it('collapses into a single feed item', () => {
      expect(result).toHaveLength(1);
    });

    it('collapses into a CollapsedArticlesAddedToList item', () => {
      expect(result[0].type).toBe('CollapsedArticlesAddedToList');
      expect(result[0]).toStrictEqual(expect.objectContaining({ listId }));
    });

    it('returns the number of article events collapsed', () => {
      expect(result[0]).toStrictEqual(expect.objectContaining({ articleCount: 2 }));
    });

    it('returns the most recent date', () => {
      expect(result[0]).toStrictEqual(expect.objectContaining({ date: laterDate }));
    });
  });

  describe('given three consecutive events adding articles to the same list', () => {
    const laterDate = new Date('2021-09-14 12:00');
    const earlierDate = new Date('2021-09-14 11:00');
    const myListId = arbitraryListId();

    const result = pipe(
      [
        constructEvent('ArticleAddedToList')({ articleId: new ArticleId(arbitraryExpressionDoi()), listId: myListId, date: earlierDate }),
        constructEvent('ArticleAddedToList')({ articleId: new ArticleId(arbitraryExpressionDoi()), listId: myListId, date: earlierDate }),
        constructEvent('ArticleAddedToList')({ articleId: new ArticleId(arbitraryExpressionDoi()), listId: myListId, date: laterDate }),
      ],
      identifyFeedItems(20, 1),
      E.match(shouldNotBeCalled, identity),
      (pageOfItems) => pageOfItems.items,
    );

    it('collapses into a single feed item', () => {
      expect(result).toHaveLength(1);
    });

    it('returns the number of article events collapsed', () => {
      expect(result[0]).toStrictEqual(expect.objectContaining({ articleCount: 3 }));
    });

    it('collapses into a CollapsedArticlesAddedToList item', () => {
      expect(result[0].type).toBe('CollapsedArticlesAddedToList');
      expect(result[0]).toStrictEqual(expect.objectContaining({ listId: myListId }));
    });

    it('returns the most recent date', () => {
      expect(result[0]).toStrictEqual(expect.objectContaining({ date: laterDate }));
    });
  });

  describe('given two articles are added to a list separated by an article added to a different list', () => {
    const myList = arbitraryListId();
    const date1 = new Date('2022-10-01');
    const date2 = new Date('2022-10-02');
    const date3 = new Date('2022-10-03');

    const events = [
      constructEvent('ArticleAddedToList')({ articleId: new ArticleId(arbitraryExpressionDoi()), listId: myList, date: date1 }),
      constructEvent('ArticleAddedToList')({ articleId: new ArticleId(arbitraryExpressionDoi()), listId: arbitraryListId(), date: date2 }),
      constructEvent('ArticleAddedToList')({ articleId: new ArticleId(arbitraryExpressionDoi()), listId: myList, date: date3 }),
    ];
    const result = pipe(
      events,
      identifyFeedItems(20, 1),
      E.match(shouldNotBeCalled, identity),
      (pageOfItems) => pageOfItems.items,
    );

    it('does not collapse the events', () => {
      expect(result).toHaveLength(3);
    });

    it('feed items are returned sorted newest to oldest', () => {
      expect(result[0].date).toStrictEqual(date3);
      expect(result[1].date).toStrictEqual(date2);
      expect(result[2].date).toStrictEqual(date1);
    });
  });

  describe('given no relevant events', () => {
    const result = identifyFeedItems(20, 1)([]);

    it('does not fail', () => {
      expect(E.isRight(result)).toBe(true);
    });
  });
});
