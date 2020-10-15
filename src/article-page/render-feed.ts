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

    let items = feedItems.map(renderFeedItem);

    if (doi.value === '10.1101/646810') {
      items = items.slice(0, -2);
      items.push(`
        <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/956882186996662272/lwyH1HFe_200x200.jpg" alt="">
        <div>
          <p class="article-feed__item__title">
            Published on bioRxiv
          </p>
          <p>
            We couldn't get version information from bioRxiv. Please try refreshing this page.
          </p>
        </div>
      `);
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
};
