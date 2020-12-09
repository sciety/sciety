import * as O from 'fp-ts/lib/Option';
import templateListItems from './list-items';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type RenderSummaryFeedList<T> = (events: ReadonlyArray<T>) => Promise<O.Option<HtmlFragment>>;

type RenderSummaryFeedItem<T> = (event: T) => Promise<HtmlFragment>;

export default <T>(
  renderSummaryFeedItem: RenderSummaryFeedItem<T>,
): RenderSummaryFeedList<T> => async (events) => {
  if (events.length === 0) {
    return O.none;
  }
  const items = await Promise.all(events.map(renderSummaryFeedItem));
  return O.some(toHtmlFragment(`
    <ol class="summary-feed-list" role="list">
      ${templateListItems(items, 'summary-feed-list__list_item')}
    </ol>
  `));
};
