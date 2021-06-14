import { URL } from 'url';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { handleArticleVersionErrors } from '../../../src/article-page/activity-page/handle-article-version-errors';
import { FeedItem } from '../../../src/article-page/activity-page/render-feed';
import { toHtmlFragment } from '../../../src/types/html-fragment';
import { sanitise } from '../../../src/types/sanitised-html-fragment';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('handle-article-version-errors', () => {
  describe('there are article version events', () => {
    it('remains unchanged', () => {
      const inputItems: ReadonlyArray<FeedItem> = [
        {
          type: 'article-version',
          version: 1,
          occurredAt: new Date(),
          source: new URL('https://example.com'),
          server: 'biorxiv',
        },
      ];

      const feedItems = handleArticleVersionErrors(inputItems, 'biorxiv');

      expect(feedItems).toStrictEqual(inputItems);
    });
  });

  describe('there are no article version events', () => {
    it('appends an error feed item', () => {
      const groupId = arbitraryGroupId();
      const inputItems: ReadonlyArray<FeedItem> = [
        {
          type: 'review',
          id: arbitraryReviewId(),
          occurredAt: new Date(),
          source: O.some(new URL('https://example.com')),
          groupId,
          groupName: 'OUR GROUP',
          groupAvatar: '/images/us.png',
          fullText: pipe('review-1', toHtmlFragment, sanitise, O.some),
          counts: {
            helpfulCount: 0,
            notHelpfulCount: 0,
          },
          current: O.none,
        },
        {
          type: 'review',
          id: arbitraryReviewId(),
          occurredAt: new Date(),
          source: O.some(new URL('https://example.com')),
          groupId,
          groupName: 'OUR GROUP',
          groupAvatar: '/images/us.png',
          fullText: pipe('review-2', toHtmlFragment, sanitise, O.some),
          counts: {
            helpfulCount: 0,
            notHelpfulCount: 0,
          },
          current: O.none,
        },
      ];

      const feedItems = handleArticleVersionErrors(inputItems, 'biorxiv');

      expect(feedItems).toHaveLength(3);
      expect(feedItems[2].type).toBe('article-version-error');
    });
  });
});
