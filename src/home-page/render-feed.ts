import { Maybe } from 'true-myth';
import { FeedEvent, RenderFeedItem } from './render-feed-item';
import templateListItems from '../templates/list-items';
import { NonEmptyArray } from '../types/non-empty-array';
import { UserId } from '../types/user-id';

type RenderFeed = (userId: Maybe<UserId>) => Promise<string>;

export type GetEvents = (userId: Maybe<UserId>) => Promise<NonEmptyArray<FeedEvent>>;

export { FeedEvent } from './render-feed-item';

export default (
  getEvents: GetEvents,
  renderFeedItem: RenderFeedItem,
): RenderFeed => (
  async (userId) => {
    const events = await getEvents(userId);
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
