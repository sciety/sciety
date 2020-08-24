import { FeedEvent, RenderFeedItem } from './render-feed-item';
import templateListItems from '../templates/list-items';
import EditorialCommunityId from '../types/editorial-community-id';
import { NonEmptyArray } from '../types/non-empty-array';
import { UserId } from '../types/user-id';

type RenderFeed = (userId: UserId) => Promise<string>;

type Follows = (editorialCommunityId: EditorialCommunityId) => boolean;
export type GetFollows = (userId: UserId) => Promise<Follows>;
export type GetEvents = (follows: Follows) => Promise<NonEmptyArray<FeedEvent>>;

export { FeedEvent } from './render-feed-item';

export default (
  getFollows: GetFollows,
  getEvents: GetEvents,
  renderFeedItem: RenderFeedItem,
): RenderFeed => (
  async (userId) => {
    const follows = await getFollows(userId);
    const events = await getEvents(follows);
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
