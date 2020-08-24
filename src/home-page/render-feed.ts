import { FeedEvent, RenderFeedItem } from './render-feed-item';
import templateListItems from '../templates/list-items';
import FollowList from '../types/follow-list';
import { Follows } from '../types/follows';
import { NonEmptyArray } from '../types/non-empty-array';
import { UserId } from '../types/user-id';

type RenderFeed = (userId: UserId) => Promise<string>;

export type GetFollowList = (userId: UserId) => Promise<FollowList>;
export type GetEvents = (follows: Follows) => Promise<NonEmptyArray<FeedEvent>>;

export { FeedEvent } from './render-feed-item';

export default (
  getFollowList: GetFollowList,
  getEvents: GetEvents,
  renderFeedItem: RenderFeedItem,
): RenderFeed => (
  async (userId) => {
    const followList = await getFollowList(userId);
    const events = await getEvents((id) => followList.follows(id));
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
