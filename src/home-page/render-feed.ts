import { Maybe } from 'true-myth';
import { FeedEvent, RenderFeedItem } from './render-feed-item';
import templateListItems from '../templates/list-items';
import { UserId } from '../types/user-id';

type RenderFeed = (userId: Maybe<UserId>) => Promise<string>;

export type GetEvents = (userId: Maybe<UserId>) => Promise<ReadonlyArray<FeedEvent>>;

export { FeedEvent } from './render-feed-item';

export default (
  getEvents: GetEvents,
  renderFeedItem: RenderFeedItem,
): RenderFeed => (
  async (userId) => {
    if (userId.isNothing()) {
      return `
        <section>
          <h2 class="ui header">
            Feed
          </h2>
          <p class="log-in-invitation">
            Log in to see your feed here or start building a new one by following some communities!
          </p>
        </section>
      `;
    }
    const events = await getEvents(userId);
    const feedItems = await Promise.all(events.map(renderFeedItem));
    return `
      <section>
        <h2 class="ui header">
          Feed
        </h2>
        <ol class="ui large feed" role="list">
          ${templateListItems(feedItems, 'event')}
        </ol>
      </section>
    `;
  }
);
