import * as E from 'fp-ts/Either';
import { identity, pipe } from 'fp-ts/function';
import { articleAddedToList } from '../../src/domain-events';
import { identifyFeedItems } from '../../src/sciety-feed-page/identify-feed-items';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryListId } from '../types/list-id.helper';

describe('identify-feed-items', () => {
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

  describe('given two consecutive events adding articles to the same list', () => {
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
});
