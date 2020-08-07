import { RenderFeedItem } from './render-feed-item';
import templateListItems from '../templates/list-items';
import { DomainEvent } from '../types/domain-events';
import { NonEmptyArray } from '../types/non-empty-array';

type RenderFeed = () => Promise<string>;

export type GetEvents = () => Promise<NonEmptyArray<DomainEvent>>;

export default (
  getEvents: GetEvents,
  renderFeedItem: RenderFeedItem,
): RenderFeed => (
  async () => {
    const events = await getEvents();
    const feedItems = await Promise.all(events.map(renderFeedItem));
    return `
      <section>
        <h2 class="ui header">
          Feed
        </h2>
        <ol class="ui large feed">
          ${templateListItems(feedItems, 'event')}
        </ol>
      </section>
    `;
  }
);
