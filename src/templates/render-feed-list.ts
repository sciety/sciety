import templateListItems from './list-items';
import { FeedEvent, RenderFeedItem } from './render-feed-item';

export type RenderFeedList = (events: ReadonlyArray<FeedEvent>) => Promise<string>;

export default (
  renderFeedItem: RenderFeedItem,
): RenderFeedList => async (events) => {
  const feedItems = await Promise.all(events.map(renderFeedItem));
  return `
    <ol class="summary-feed-list" role="list">
      ${templateListItems(feedItems, 'summary-feed-list__list_item')}
    </ol>
  `;
};
