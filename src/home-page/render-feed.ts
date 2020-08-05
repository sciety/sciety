import { RenderFeedItem } from './render-feed-item';
import templateListItems from '../templates/list-items';
import EditorialCommunityId from '../types/editorial-community-id';
import { Event } from '../types/events';
import { NonEmptyArray } from '../types/non-empty-array';

type RenderFeed = () => Promise<string>;

export type GetFollowList = () => Promise<Array<EditorialCommunityId>>;

export type GetEvents = (followList: Array<EditorialCommunityId>) => Promise<NonEmptyArray<Event>>;

export default (
  getFollowList: GetFollowList,
  getEvents: GetEvents,
  renderFeedItem: RenderFeedItem,
): RenderFeed => (
  async () => {
    const followList = await getFollowList();
    const events = await getEvents(followList);
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
