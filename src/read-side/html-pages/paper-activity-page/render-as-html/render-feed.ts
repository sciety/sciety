import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { renderEvaluationPublishedFeedItem } from './render-evaluation-published-feed-item';
import { renderExpressionPublishedFeedItem } from './render-expression-published-feed-item';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { templateDate } from '../../shared-components/date';
import { renderListItems } from '../../shared-components/list-items';
import { CassyniSeminarPublishedFeedItem, FeedItem } from '../view-model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const renderCassyniSeminarPublishedFeedItem = (feedItem: CassyniSeminarPublishedFeedItem) => toHtmlFragment(`
  <div class="activity-feed__item__contents">
    <header class="activity-feed__item__header">
      
      <div class="activity-feed__item__meta">
        <div class="activity-feed__item__title">
          <a href="#">
            Version published to 
          </a>
        </div>
        ${templateDate(feedItem.publishedAt, 'activity-feed__item__date')}
      </div>
    </header>
    <a href="https://doi.org/10.52843/cassyni.y1p61f">A link</a>
  </div>
`);

const renderFeedItem = (feedItem: FeedItem) => {
  switch (feedItem.type) {
    case 'expression-published':
      return renderExpressionPublishedFeedItem(feedItem);
    case 'evaluation-published':
      return renderEvaluationPublishedFeedItem(feedItem, 850);
    case 'cassyni-seminar-published':
      return renderCassyniSeminarPublishedFeedItem(feedItem);
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
