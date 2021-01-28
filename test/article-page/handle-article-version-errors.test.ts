import { URL } from 'url';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { createHandleArticleVersionErrors } from '../../src/article-page/handle-article-version-errors';
import { FeedItem, GetFeedItems } from '../../src/article-page/render-feed';
import { Doi } from '../../src/types/doi';
import { EditorialCommunityId } from '../../src/types/editorial-community-id';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';

describe('handle-article-version-errors', () => {
  describe('there are article version events', () => {
    it('remains unchanged', async () => {
      const inputItems: ReadonlyArray<FeedItem> = [
        {
          type: 'article-version',
          version: 1,
          occurredAt: new Date(),
          source: new URL('https://example.com'),
          server: 'biorxiv',
        },
      ];
      const originalGetFeedItems: GetFeedItems = () => T.of(inputItems);
      const handleArticleVersionErrors = createHandleArticleVersionErrors(originalGetFeedItems);
      const feedItems = await handleArticleVersionErrors(new Doi('10.1111/123456'), 'biorxiv')();

      expect(feedItems).toStrictEqual(inputItems);
    });
  });

  describe('there are no article version events', () => {
    it('appends an error feed item', async () => {
      const inputItems: ReadonlyArray<FeedItem> = [
        {
          type: 'review',
          id: new Doi('10.1111/12345678'),
          occurredAt: new Date(),
          source: new URL('https://example.com'),
          editorialCommunityId: new EditorialCommunityId('community-1'),
          editorialCommunityName: 'OUR COMMUNITY',
          editorialCommunityAvatar: new URL('http://example.com/images/us.png'),
          fullText: pipe('review-1', toHtmlFragment, sanitise, O.some),
        },
        {
          type: 'review',
          id: new Doi('10.1111/12345679'),
          occurredAt: new Date(),
          source: new URL('https://example.com'),
          editorialCommunityId: new EditorialCommunityId('community-1'),
          editorialCommunityName: 'OUR COMMUNITY',
          editorialCommunityAvatar: new URL('http://example.com/images/us.png'),
          fullText: pipe('review-2', toHtmlFragment, sanitise, O.some),
        },
      ];
      const originalGetFeedItems: GetFeedItems = () => T.of(inputItems);
      const handleArticleVersionErrors = createHandleArticleVersionErrors(originalGetFeedItems);
      const feedItems = await handleArticleVersionErrors(new Doi('10.1101/123456'), 'biorxiv')();

      expect(feedItems).toHaveLength(3);
      expect(feedItems[2].type).toBe('article-version-error');
    });
  });
});
