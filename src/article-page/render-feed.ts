import { Result } from 'true-myth';
import { ArticleVersionFeedItem, RenderArticleVersionFeedItem } from './render-article-version-feed-item';
import { RenderReviewFeedItem, ReviewFeedItem } from './render-review-feed-item';
import renderListItems from '../shared-components/list-items';
import Doi from '../types/doi';

type RenderFeed = (doi: Doi) => Promise<Result<string, 'no-content'>>;

export type FeedItem = ReviewFeedItem | ArticleVersionFeedItem;

export type GetFeedItems = (doi: Doi) => Promise<ReadonlyArray<FeedItem>>;

export default (
  getFeedItems: GetFeedItems,
  renderReviewFeedItem: RenderReviewFeedItem,
  renderArticleVersionFeedItem: RenderArticleVersionFeedItem,
): RenderFeed => {
  const renderFeedItem = (feedItem: FeedItem): string => {
    switch (feedItem.type) {
      case 'article-version':
        return renderArticleVersionFeedItem(feedItem);
      case 'review':
        return renderReviewFeedItem(feedItem);
    }
  };

  return async (doi) => {
    const feedItems = await getFeedItems(doi);

    if (feedItems.length === 0) {
      return Result.err('no-content');
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
