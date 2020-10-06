import { URL } from 'url';
import { Result } from 'true-myth';
import { RenderReviewFeedItem, Review } from './render-review-feed-item';
import { ArticleVersionFeedItem, RenderVersionFeedItem } from './render-version-feed-item';
import renderListItems from '../templates/list-items';
import Doi from '../types/doi';

type RenderFeed = (doi: Doi) => Promise<Result<string, 'no-content'>>;

export type GetReviews = (doi: Doi) => Promise<ReadonlyArray<Review|ArticleVersionFeedItem>>;

export default (
  getFeedItems: GetReviews,
  renderReviewFeedItem: RenderReviewFeedItem,
  renderVersionFeedItem: RenderVersionFeedItem,
): RenderFeed => async (doi) => {
  const feedItems = await getFeedItems(doi);

  if (feedItems.length === 0) {
    return Result.err('no-content');
  }

  const isArticleVersionFeedItem = (feedItem: Review|ArticleVersionFeedItem):
    feedItem is ArticleVersionFeedItem => (
    Object.prototype.hasOwnProperty.call(feedItem, 'postedAt')
  );

  const items = feedItems.map((feedItem) => {
    if (isArticleVersionFeedItem(feedItem)) {
      return renderVersionFeedItem(feedItem);
    }
    return renderReviewFeedItem(feedItem);
  });

  if (doi.value === '10.1101/646810') {
    items.push(renderVersionFeedItem({
      source: new URL('https://www.biorxiv.org/content/10.1101/646810v1?versioned=true'),
      postedAt: new Date('2019-05-24'),
      version: 1,
    }));
  }

  return Result.ok(`
    <section>
      <h2>Feed</h2>

      <ol role="list" class="article-feed">
        ${renderListItems(items, 'article-feed__item')}
      </ol>
    </section>
  `);
};
