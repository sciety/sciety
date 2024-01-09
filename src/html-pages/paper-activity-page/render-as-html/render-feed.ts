import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { flow } from 'fp-ts/function';
import { renderVersionErrorFeedItem } from './render-article-version-error-feed-item';
import { renderListItems } from '../../../shared-components/render-list-items';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { FeedItem } from '../view-model';
import { renderExpressionPublishedFeedItem } from './render-expression-published-feed-item';
import { renderEvaluationPublishedFeedItem } from './render-evaluation-published-feed-item';

const renderFeedItem = (feedItem: FeedItem) => {
  switch (feedItem.type) {
    case 'expression-published':
      return renderExpressionPublishedFeedItem(feedItem);
    case 'article-version-error':
      return renderVersionErrorFeedItem(feedItem.server);
    default:
      return renderEvaluationPublishedFeedItem(feedItem, 850);
  }
};

type RenderFeed = (feedItems: RNEA.ReadonlyNonEmptyArray<FeedItem>) => HtmlFragment;

export const renderFeed: RenderFeed = flow(
  RNEA.map(renderFeedItem),
  (items) => `
    <section class="activity-feed">
      <h2 class="activity-feed__header">Article activity feed</h2>
      <ol role="list" class="activity-feed__list">
        ${renderListItems(items, 'activity-feed__item')}
      </ol>
    </section>
  `,
  toHtmlFragment,
);
