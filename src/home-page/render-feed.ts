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
    let contents = '';
    if (userId.isNothing()) {
      contents = `
        <p class="log-in-invitation">
          Log in to see your feed here or start building a new one by following some communities!
          <img src="/static/images/feed-screenshot.png" alt="Screenshot of a feed" width="100%">
        </p>
      `;
    } else {
      const events = await getEvents(userId);
      const feedItems = await Promise.all(events.map(renderFeedItem));
      contents = `
        <ol class="ui large feed" role="list">
          ${templateListItems(feedItems, 'event')}
        </ol>
      `;
    }
    return `
      <section>
        <h2 class="ui header">
          Feed
        </h2>
        ${contents}
      </section>
    `;
  }
);
