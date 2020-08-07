import { RenderFeedItem } from './render-feed-item';
import templateListItems from '../templates/list-items';
import EditorialCommunityId from '../types/editorial-community-id';
import { Event } from '../types/events';

export type RenderFeed = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

export type GetEvents = (editorialCommunityId: EditorialCommunityId) => Promise<Array<Event>>;

type RenderFollowToggle = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

const renderFollowToggle: RenderFollowToggle = async (editorialCommunityId) => `
  <form method="post" action="/unfollow">
    <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}">
    <button type="submit" class="ui mini button">Unfollow</button>
  </form>
`;

export default (
  getEvents: GetEvents,
  renderFeedItem: RenderFeedItem,
): RenderFeed => (
  async (editorialCommunityId) => {
    const events = await getEvents(editorialCommunityId);
    const feedItems = await Promise.all(events.map(renderFeedItem));
    return `
      <section class="ui very padded vertical segment">
        <h2 class="ui header">
          Feed
        </h2>
        ${await renderFollowToggle(editorialCommunityId)}
        <ol class="ui large feed">
          ${templateListItems(feedItems, 'event')}
        </ol>
      </section>
    `;
  }
);
