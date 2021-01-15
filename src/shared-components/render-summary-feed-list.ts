import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { flow } from 'fp-ts/lib/function';
import templateListItems from './list-items';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

const renderAsList = (items: ReadonlyArray<HtmlFragment>): string => `
  <ol class="summary-feed-list" role="list">
    ${templateListItems(items, 'summary-feed-list__list_item')}
  </ol>
`;

export type RenderSummaryFeedList<T> = (events: ReadonlyArray<T>) => T.Task<O.Option<HtmlFragment>>;

type RenderSummaryFeedItem<E> = (event: E) => T.Task<HtmlFragment>;

export default <T>(renderSummaryFeedItem: RenderSummaryFeedItem<T>): RenderSummaryFeedList<T> => flow(
  T.traverseArray(renderSummaryFeedItem),
  T.map(O.fromPredicate((es) => es.length > 0)),
  T.map(O.map(flow(
    renderAsList,
    toHtmlFragment,
  ))),
);
