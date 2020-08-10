import { RenderFeedItem } from './render-feed-item';
import { RenderFollowToggle } from './render-follow-toggle';
import templateListItems from '../templates/list-items';
import { DomainEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';

export type RenderFeed = (editorialCommunityId: EditorialCommunityId, followList: FollowList) => Promise<string>;

export type GetEvents = (editorialCommunityId: EditorialCommunityId) => Promise<Array<DomainEvent>>;

export default (
  getEvents: GetEvents,
  renderFeedItem: RenderFeedItem,
  renderFollowToggle: RenderFollowToggle,
): RenderFeed => async (editorialCommunityId, followList) => {
  const events = await getEvents(editorialCommunityId);
  const feedItems = await Promise.all(events.map(renderFeedItem));
  return `
      <section class="ui very padded vertical segment">
        <h2 class="ui header">
          Feed
        </h2>
        ${await renderFollowToggle(followList, editorialCommunityId)}
        <ol class="ui large feed">
          ${templateListItems(feedItems, 'event')}
        </ol>
      </section>
    `;
};
