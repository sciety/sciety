import { URL } from 'url';
import createRenderArticleVersionFeedItem, { ArticleVersionFeedItem } from '../../src/article-page/render-article-version-feed-item';

describe('render-article-version-feed-item', () => {
  it('renders the feed item', async () => {
    const feedItem: ArticleVersionFeedItem = {
      type: 'article-version',
      postedAt: new Date(),
      source: new URL('http://example.com'),
      version: 3,
    };

    const renderArticleVersionFeedItem = createRenderArticleVersionFeedItem();

    const rendered = await renderArticleVersionFeedItem(feedItem);

    expect(rendered).toContain('Version 3');
  });
});
