import { URL } from 'url';
import { renderArticleVersionFeedItem } from '../../../../src/html-pages/article-page/render-as-html/render-article-version-feed-item.js';
import { ArticleVersionFeedItem } from '../../../../src/html-pages/article-page/view-model.js';

describe('render-article-version-feed-item', () => {
  it('renders the feed item', async () => {
    const feedItem: ArticleVersionFeedItem = {
      type: 'article-version',
      publishedAt: new Date(),
      source: new URL('http://example.com'),
      version: 3,
      server: 'biorxiv',
    };

    const rendered = await renderArticleVersionFeedItem(feedItem);

    expect(rendered).toContain('Version 3');
  });
});
