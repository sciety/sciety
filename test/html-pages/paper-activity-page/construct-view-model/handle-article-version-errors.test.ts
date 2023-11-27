import { URL } from 'url';
import { handleArticleVersionErrors } from '../../../../src/html-pages/paper-activity-page/construct-view-model/handle-article-version-errors';
import { FeedItem } from '../../../../src/html-pages/paper-activity-page/view-model';
import * as RFI from '../evaluation-feed-item.helper';

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
