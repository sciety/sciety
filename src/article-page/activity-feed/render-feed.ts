import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { flow } from 'fp-ts/function';
import { renderVersionErrorFeedItem } from './render-article-version-error-feed-item';
import { ArticleVersionFeedItem, renderArticleVersionFeedItem } from './render-article-version-feed-item';
import { renderReviewFeedItem, ReviewFeedItem } from './render-review-feed-item';
import { templateListItems } from '../../shared-components/list-items';
import { ArticleServer } from '../../types/article-server';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

type ArticleVersionErrorFeedItem = { type: 'article-version-error', server: ArticleServer };

export type FeedItem = ReviewFeedItem | ArticleVersionFeedItem | ArticleVersionErrorFeedItem;

const renderFeedItem = (feedItem: FeedItem) => {
  switch (feedItem.type) {
    case 'article-version':
      return renderArticleVersionFeedItem(feedItem);
    case 'article-version-error':
      return renderVersionErrorFeedItem(feedItem.server);
    default:
      return renderReviewFeedItem(850)(feedItem);
  }
};

type RenderFeed = (feedItems: RNEA.ReadonlyNonEmptyArray<FeedItem>) => HtmlFragment;

export const renderFeed: RenderFeed = flow(
  RNEA.map(renderFeedItem),
  (items) => `
    <section class="activity-feed">
      <h2 class="activity-feed__header">Article activity feed</h2>
      <ol role="list" class="activity-feed__list">
        ${templateListItems(items, 'activity-feed__item')}
      </ol>
    </section>
  `,
  toHtmlFragment,
);
