import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { flow } from 'fp-ts/function';
import { ArticleVersionFeedItem } from './render-article-version-feed-item';
import { ReviewFeedItem } from './render-review-feed-item';
import { templateListItems } from '../shared-components/list-items';
import { ArticleServer } from '../types/article-server';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderFeed = (feedItems: RNEA.ReadonlyNonEmptyArray<FeedItem>) => HtmlFragment;

type ArticleVersionErrorFeedItem = { type: 'article-version-error', server: ArticleServer };

export type FeedItem = ReviewFeedItem | ArticleVersionFeedItem | ArticleVersionErrorFeedItem;

type RenderFeedItem = (feedItem: FeedItem) => HtmlFragment;

export const renderFeed = (
  renderFeedItem: RenderFeedItem,
): RenderFeed => flow(
  RNEA.map(renderFeedItem),
  (items) => `
    <section class="activity-feed">
      <ol role="list" class="activity-feed__list">
        ${templateListItems(items, 'activity-feed__item')}
      </ol>
    </section>
  `,
  toHtmlFragment,
);
