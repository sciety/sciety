import { URL } from 'url';
import { ArticleVersionFeedItem, renderArticleVersionFeedItem } from '../../../src/article-page/activity-page/render-article-version-feed-item';

describe('render-article-version-feed-item', () => {
  it('renders the feed item', async () => {
    const feedItem: ArticleVersionFeedItem = {
      type: 'article-version',
      occurredAt: new Date(),
      source: new URL('http://example.com'),
      version: 3,
      server: 'biorxiv',
    };

    const rendered = await renderArticleVersionFeedItem(feedItem);

    expect(rendered).toContain('Version 3');
  });
});
