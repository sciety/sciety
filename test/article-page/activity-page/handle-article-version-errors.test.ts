import { URL } from 'url';
import * as RFI from './review-feed-item.helper';
import { handleArticleVersionErrors } from '../../../src/article-page/activity-page/handle-article-version-errors';
import { FeedItem } from '../../../src/article-page/activity-page/render-feed';

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
      const inputItems: ReadonlyArray<FeedItem> = [
        RFI.arbitrary(),
        RFI.arbitrary(),
      ];

      const feedItems = handleArticleVersionErrors(inputItems, 'biorxiv');

      expect(feedItems).toHaveLength(3);
      expect(feedItems[2].type).toBe('article-version-error');
    });
  });
});
