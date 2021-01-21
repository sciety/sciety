import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { flow } from 'fp-ts/lib/function';
import templateListItems from './list-items';
import { FeedEvent } from './render-summary-feed-item';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

const renderAsList = (items: ReadonlyArray<HtmlFragment>): string => `
  <ol class="summary-feed-list" role="list">
    ${templateListItems(items, 'summary-feed-list__list_item')}
  </ol>
`;

export type RenderSummaryFeedList = (events: ReadonlyArray<FeedEvent>) => T.Task<O.Option<HtmlFragment>>;

type RenderSummaryFeedItem = (event: FeedEvent) => T.Task<HtmlFragment>;

export const renderSummaryFeedList = (
  renderSummaryFeedItem: RenderSummaryFeedItem,
): RenderSummaryFeedList => flow(
  T.traverseArray(renderSummaryFeedItem),
  T.map(O.fromPredicate((es) => es.length > 0)),
  T.map(O.map(flow(
    renderAsList,
    toHtmlFragment,
  ))),
);
