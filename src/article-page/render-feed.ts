import { Result } from 'true-myth';
import { RenderReviewFeedItem, ReviewFeedItem } from './render-review-feed-item';
import { ArticleVersionFeedItem, RenderVersionFeedItem } from './render-version-feed-item';
import renderListItems from '../templates/list-items';
import Doi from '../types/doi';

type RenderFeed = (doi: Doi) => Promise<Result<string, 'no-content'>>;

export type GetFeedItems = (doi: Doi) => Promise<ReadonlyArray<ReviewFeedItem|ArticleVersionFeedItem>>;

export default (
  getFeedItems: GetFeedItems,
  renderReviewFeedItem: RenderReviewFeedItem,
  renderVersionFeedItem: RenderVersionFeedItem,
): RenderFeed => async (doi) => {
  const feedItems = await getFeedItems(doi);

  if (feedItems.length === 0) {
    return Result.err('no-content');
  }

  const isArticleVersionFeedItem = (feedItem: ReviewFeedItem|ArticleVersionFeedItem):
    feedItem is ArticleVersionFeedItem => (
    Object.prototype.hasOwnProperty.call(feedItem, 'postedAt')
  );

  const items = feedItems.map((feedItem) => {
    if (isArticleVersionFeedItem(feedItem)) {
      return renderVersionFeedItem(feedItem);
    }
    return renderReviewFeedItem(feedItem);
  });

  return Result.ok(`
    <section>
      <h2>Feed</h2>

      <ol role="list" class="article-feed">
        ${renderListItems(items, 'article-feed__item')}
      </ol>
    </section>
  `);
};
