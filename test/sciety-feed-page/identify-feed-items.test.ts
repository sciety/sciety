import * as E from 'fp-ts/Either';
import { identity, pipe } from 'fp-ts/function';
import { articleAddedToList, userSavedArticle } from '../../src/domain-events';
import { identifyFeedItems } from '../../src/sciety-feed-page/identify-feed-items';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryListId } from '../types/list-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('identify-feed-items', () => {
  describe('when there is a uninteresting event', () => {
    const events = [
      userSavedArticle(arbitraryUserId(), arbitraryArticleId()),
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

  describe('when a single article is added to a list', () => {
    const events = [
      articleAddedToList(arbitraryArticleId(), arbitraryListId()),
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
        articleAddedToList(arbitraryArticleId(), listId, earlierDate),
        articleAddedToList(arbitraryArticleId(), listId, laterDate),
      ],
      identifyFeedItems(20, 1),
      E.match(shouldNotBeCalled, identity),
      (pageOfItems) => pageOfItems.items,
    );

    it('collapses into a single feed item', () => {
      expect(result).toHaveLength(1);
    });

    it('collapses into a CollapsedArticlesAddedToList item', () => {
      expect(result).toStrictEqual([expect.objectContaining(
        {
          type: 'CollapsedArticlesAddedToList',
          listId,
        },
      )]);
    });

    it('returns the number of article events collapsed', () => {
      expect(result).toStrictEqual([expect.objectContaining(
        {
          articleCount: 2,
        },
      )]);
    });

    it.failing('returns the most recent date', () => {
      expect(result).toStrictEqual([expect.objectContaining(
        {
          date: laterDate,
        },
      )]);
    });
  });

  describe('given three consecutive events adding articles to the same list', () => {
    const laterDate = new Date('2021-09-14 12:00');
    const earlierDate = new Date('2021-09-14 11:00');
    const myListId = arbitraryListId();

    const result = pipe(
      [
        articleAddedToList(arbitraryArticleId(), myListId, earlierDate),
        articleAddedToList(arbitraryArticleId(), myListId, earlierDate),
        articleAddedToList(arbitraryArticleId(), myListId, laterDate),
      ],
      identifyFeedItems(20, 1),
      E.match(shouldNotBeCalled, identity),
      (pageOfItems) => pageOfItems.items,
    );

    it('collapses into a single feed item', () => {
      expect(result).toHaveLength(1);
    });

    it('returns the number of article events collapsed', () => {
      expect(result).toStrictEqual([expect.objectContaining(
        {
          articleCount: 3,
        },
      )]);
    });

    it('collapses into a CollapsedArticlesAddedToList item', () => {
      expect(result).toStrictEqual([expect.objectContaining(
        {
          type: 'CollapsedArticlesAddedToList',
          listId: myListId,
        },
      )]);
    });

    it.failing('returns the most recent date', () => {
      expect(result).toStrictEqual([expect.objectContaining(
        {
          date: laterDate,
        },
      )]);
    });
  });

  describe('given two articles are added to a list separated by an article added to a different list', () => {
    const myList = arbitraryListId();

    const events = [
      articleAddedToList(arbitraryArticleId(), myList),
      articleAddedToList(arbitraryArticleId(), arbitraryListId()),
      articleAddedToList(arbitraryArticleId(), myList),
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

    it.todo('feed items are returned sorted newest to oldest');
  });
});
