import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { flow } from 'fp-ts/lib/function';
import templateListItems from './list-items';
import {
  FeedEvent, GetActor, GetArticle, renderSummaryFeedItem,
} from './render-summary-feed-item';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

const renderAsList = (items: ReadonlyArray<HtmlFragment>): string => `
  <ol class="summary-feed-list" role="list">
    ${templateListItems(items, 'summary-feed-list__list_item')}
  </ol>
`;

export type RenderSummaryFeedList = (events: ReadonlyArray<FeedEvent>) => T.Task<O.Option<HtmlFragment>>;

export const renderSummaryFeedList = (
  getActor: GetActor,
  getArticle: GetArticle,
): RenderSummaryFeedList => flow(
  T.traverseArray(renderSummaryFeedItem(getActor, getArticle)),
  T.map(O.fromPredicate((es) => es.length > 0)),
  T.map(O.map(flow(
    renderAsList,
    toHtmlFragment,
  ))),
);
