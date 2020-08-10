import { RenderFeedItem } from './render-feed-item';
import templateListItems from '../templates/list-items';
import { DomainEvent } from '../types/domain-events';
import FollowList from '../types/follow-list';
import { NonEmptyArray } from '../types/non-empty-array';

type RenderFeed = (followList: FollowList) => Promise<string>;

export type GetEvents = (followList: FollowList) => Promise<NonEmptyArray<DomainEvent>>;

export default (
  getEvents: GetEvents,
  renderFeedItem: RenderFeedItem,
): RenderFeed => (
  async (followList) => {
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
