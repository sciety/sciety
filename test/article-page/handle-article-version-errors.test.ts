import { URL } from 'url';
import createHandleArticleVersionErrors from '../../src/article-page/handle-article-version-errors';
import { FeedItem, GetFeedItems } from '../../src/article-page/render-feed';
import Doi from '../../src/types/doi';

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
    it.todo('appends an error feed item');
  });
});
