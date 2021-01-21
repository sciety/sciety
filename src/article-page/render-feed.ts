import * as O from 'fp-ts/lib/Option';
import { Result } from 'true-myth';
import { createRenderArticleVersionErrorFeedItem } from './render-article-version-error-feed-item';
import { ArticleVersionFeedItem, RenderArticleVersionFeedItem } from './render-article-version-feed-item';
import { RenderReviewFeedItem, ReviewFeedItem } from './render-review-feed-item';
import renderListItems from '../shared-components/list-items';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type RenderFeed = (doi: Doi, userId: O.Option<UserId>) => Promise<Result<HtmlFragment, 'no-content'>>;

export type FeedItem = ReviewFeedItem | ArticleVersionFeedItem | { type: 'article-version-error' };

export type GetFeedItems = (doi: Doi) => Promise<ReadonlyArray<FeedItem>>;

export const createRenderFeed = (
  getFeedItems: GetFeedItems,
  renderReviewFeedItem: RenderReviewFeedItem,
  renderArticleVersionFeedItem: RenderArticleVersionFeedItem,
): RenderFeed => {
  const renderArticleVersionErrorFeedItem = createRenderArticleVersionErrorFeedItem();

  const renderFeedItem = async (feedItem: FeedItem, userId: O.Option<UserId>): Promise<HtmlFragment> => {
    switch (feedItem.type) {
      case 'article-version':
        return renderArticleVersionFeedItem(feedItem);
      case 'article-version-error':
        return renderArticleVersionErrorFeedItem();
      case 'review':
        return renderReviewFeedItem(feedItem, userId);
    }
  };

  return async (doi, userId) => {
    const feedItems = await getFeedItems(doi);

    if (feedItems.length === 0) {
      return Result.err('no-content');
    }

    const items = await Promise.all(feedItems.map(
      async (feedItem) => renderFeedItem(feedItem, userId),
    ));

    return Result.ok(toHtmlFragment(`
      <section class="article-feed">
        <h2>Feed</h2>

        <ol role="list" class="article-feed__list">
          ${renderListItems(items, 'article-feed__item')}
        </ol>
      </section>
    `));
  };
};
