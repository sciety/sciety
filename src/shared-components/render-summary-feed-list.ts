import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import templateListItems from './list-items';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type RenderSummaryFeedList<T> = (events: ReadonlyArray<T>) => Promise<O.Option<HtmlFragment>>;

type RenderSummaryFeedItem<E> = (event: E) => T.Task<HtmlFragment>;

export default <T>(
  renderSummaryFeedItem: RenderSummaryFeedItem<T>,
): RenderSummaryFeedList<T> => async (events) => {
  if (events.length === 0) {
    return O.none;
  }
  const items = await T.traverseArray(renderSummaryFeedItem)(events)();
  return O.some(toHtmlFragment(`
    <ol class="summary-feed-list" role="list">
      ${templateListItems(items, 'summary-feed-list__list_item')}
    </ol>
  `));
};
