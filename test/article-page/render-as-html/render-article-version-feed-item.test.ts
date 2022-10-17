import { URL } from 'url';
import { renderArticleVersionFeedItem } from '../../../src/article-page/render-as-html/render-article-version-feed-item';
import { ArticleVersionFeedItem } from '../../../src/article-page/view-model';

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
