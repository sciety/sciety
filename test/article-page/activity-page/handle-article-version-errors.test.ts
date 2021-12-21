import { URL } from 'url';
import * as RFI from './review-feed-item.helper';
import { handleArticleVersionErrors } from '../../../src/article-page/activity-page/handle-article-version-errors';
import { FeedItem } from '../../../src/article-page/activity-page/render-feed';

describe('handle-article-version-errors', () => {
  describe('there are article version events', () => {
    const inputItems: ReadonlyArray<FeedItem> = [
      {
        type: 'article-version',
        version: 1,
        publishedAt: new Date(),
        source: new URL('https://example.com'),
        server: 'biorxiv',
      },
    ];
    const feedItems = handleArticleVersionErrors('biorxiv')(inputItems);

    it('remains unchanged', () => {
      expect(feedItems).toStrictEqual(inputItems);
    });
  });

  describe('there are no article version events', () => {
    const inputItems: ReadonlyArray<FeedItem> = [
      RFI.arbitrary(),
      RFI.arbitrary(),
    ];
    const feedItems = handleArticleVersionErrors('biorxiv')(inputItems);

    it('appends an error feed item', () => {
      expect(feedItems).toHaveLength(3);
      expect(feedItems[2].type).toBe('article-version-error');
    });
  });
});
