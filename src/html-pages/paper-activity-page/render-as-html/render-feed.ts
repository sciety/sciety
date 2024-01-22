import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
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

export const renderFeed = (feedItems: ReadonlyArray<FeedItem>): HtmlFragment => pipe(
  feedItems,
  RA.map(renderFeedItem),
  RA.match(
    () => '',
    (items) => `
    <section class="activity-feed">
      <h2 class="activity-feed__header">Article activity feed</h2>
      <ol role="list" class="activity-feed__list">
        ${renderListItems(items, 'activity-feed__item')}
      </ol>
    </section>
  `,
  ),
  toHtmlFragment,
);
