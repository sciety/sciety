import { Maybe } from 'true-myth';
import { FeedEvent, RenderFeedItem } from './render-feed-item';
import { RenderFollowToggle } from './render-follow-toggle';
import templateListItems from '../templates/list-items';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

export type RenderFeed = (editorialCommunityId: EditorialCommunityId, userId: Maybe<UserId>) => Promise<string>;

export type GetEvents = (editorialCommunityId: EditorialCommunityId) => Promise<Array<FeedEvent>>;

export { FeedEvent } from './render-feed-item';

export default (
  getEvents: GetEvents,
  renderFeedItem: RenderFeedItem,
  renderFollowToggle: RenderFollowToggle,
): RenderFeed => async (editorialCommunityId, userId) => {
  const events = await getEvents(editorialCommunityId);
  const feedItems = await Promise.all(events.map(renderFeedItem));
  let content = '<p>It looks like this community hasn’t evaluated any articles yet. Try coming back later!</p>';
  if (feedItems.length > 0) {
    content = `<ol class="ui large feed" role="list">
      ${templateListItems(feedItems, 'event')}
    </ol>`;
  }
  return `
      <section class="ui very padded vertical segment">
        <h2>
          Feed
        </h2>
        ${await renderFollowToggle(userId, editorialCommunityId)}
        ${content}
      </section>
    `;
};
