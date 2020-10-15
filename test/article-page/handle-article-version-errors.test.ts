import { URL } from 'url';
import { Maybe } from 'true-myth';
import createHandleArticleVersionErrors from '../../src/article-page/handle-article-version-errors';
import { FeedItem, GetFeedItems } from '../../src/article-page/render-feed';
import Doi from '../../src/types/doi';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('handle-article-version-errors', () => {
  describe('there are article version events', () => {
    it('remains unchanged', async () => {
      const inputItems: ReadonlyArray<FeedItem> = [
        {
          type: 'article-version',
          version: 1,
          occurredAt: new Date(),
          source: new URL('https://example.com'),
        },
      ];
      const originalGetFeedItems: GetFeedItems = async () => inputItems;
      const handleArticleVersionErrors = createHandleArticleVersionErrors(originalGetFeedItems);
      const feedItems = await handleArticleVersionErrors(new Doi('10.1111/123456'));

      expect(feedItems).toStrictEqual(inputItems);
    });
  });

  describe('there are no article version events', () => {
    it('appends an error feed item', async () => {
      const inputItems: ReadonlyArray<FeedItem> = [
        {
          type: 'review',
          occurredAt: new Date(),
          source: new URL('https://example.com'),
          editorialCommunityId: new EditorialCommunityId('community-1'),
          editorialCommunityName: 'OUR COMMUNITY',
          editorialCommunityAvatar: new URL('http://example.com/images/us.png'),
          fullText: Maybe.just('review-1'),
        },
        {
          type: 'review',
          occurredAt: new Date(),
          source: new URL('https://example.com'),
          editorialCommunityId: new EditorialCommunityId('community-1'),
          editorialCommunityName: 'OUR COMMUNITY',
          editorialCommunityAvatar: new URL('http://example.com/images/us.png'),
          fullText: Maybe.just('review-2'),
        },
      ];
      const originalGetFeedItems: GetFeedItems = async () => inputItems;
      const handleArticleVersionErrors = createHandleArticleVersionErrors(originalGetFeedItems);
      const feedItems = await handleArticleVersionErrors(new Doi('10.1101/646810'));

      expect(feedItems).toHaveLength(3);
    });
  });
});
