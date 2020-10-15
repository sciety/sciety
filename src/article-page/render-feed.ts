import { Result } from 'true-myth';
import createRenderArticleVersionErrorFeedItem from './render-article-version-error-feed-item';
import { ArticleVersionFeedItem, RenderArticleVersionFeedItem } from './render-article-version-feed-item';
import { RenderReviewFeedItem, ReviewFeedItem } from './render-review-feed-item';
import renderListItems from '../shared-components/list-items';
import Doi from '../types/doi';

type RenderFeed = (doi: Doi) => Promise<Result<string, 'no-content'>>;

export type FeedItem = ReviewFeedItem | ArticleVersionFeedItem | { type: 'article-version-error' };

export type GetFeedItems = (doi: Doi) => Promise<ReadonlyArray<FeedItem>>;

export default (
  getFeedItems: GetFeedItems,
  renderReviewFeedItem: RenderReviewFeedItem,
  renderArticleVersionFeedItem: RenderArticleVersionFeedItem,
): RenderFeed => {
  const renderArticleVersionErrorFeedItem = createRenderArticleVersionErrorFeedItem();

  const renderFeedItem = (feedItem: FeedItem): string => {
    switch (feedItem.type) {
      case 'article-version':
        return renderArticleVersionFeedItem(feedItem);
      case 'article-version-error':
        return renderArticleVersionErrorFeedItem();
      case 'review':
        return renderReviewFeedItem(feedItem);
    }
  };

  return async (doi) => {
    let feedItems = Array.from(await getFeedItems(doi));

    if (feedItems.length === 0) {
      return Result.err('no-content');
    }

    if (doi.value === '10.1101/646810') {
      feedItems = feedItems.slice(0, -2);
      feedItems.push({ type: 'article-version-error' });
    }

    const items = feedItems.map(renderFeedItem);

    return Result.ok(`
      <section>
        <h2>Feed</h2>

        <ol role="list" class="article-feed">
          ${renderListItems(items, 'article-feed__item')}
        </ol>
      </section>
    `);
  };
};
