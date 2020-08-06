import { RenderFeedItem } from './render-feed-item';
import templateListItems from '../templates/list-items';
import EditorialCommunityId from '../types/editorial-community-id';
import { Event } from '../types/events';

export type RenderFeed = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

export type GetEvents = (editorialCommunityId: EditorialCommunityId) => Promise<Array<Event>>;

export default (
  getEvents: GetEvents,
  renderFeedItem: RenderFeedItem,
): RenderFeed => (
  async (editorialCommunityId) => {
    const events = await getEvents(editorialCommunityId);
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
