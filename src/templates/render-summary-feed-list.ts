import templateListItems from './list-items';

export type RenderSummaryFeedList<T> = (events: ReadonlyArray<T>) => Promise<string>;

type RenderSummaryFeedItem<T> = (event: T) => Promise<string>;

export default <T>(
  renderSummaryFeedItem: RenderSummaryFeedItem<T>,
): RenderSummaryFeedList<T> => async (events) => {
  const items = await Promise.all(events.map(renderSummaryFeedItem));
  return `
    <ol class="summary-feed-list" role="list">
      ${templateListItems(items, 'summary-feed-list__list_item')}
    </ol>
  `;
};
