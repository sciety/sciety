import { Maybe } from 'true-myth';
import { RenderFollowToggle } from './render-follow-toggle';
import { FeedEvent } from '../templates/render-feed-item';
import { RenderFeedList } from '../templates/render-feed-list';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

export type RenderFeed = (editorialCommunityId: EditorialCommunityId, userId: Maybe<UserId>) => Promise<string>;

export type GetEvents = (editorialCommunityId: EditorialCommunityId) => Promise<Array<FeedEvent>>;

export { FeedEvent } from '../templates/render-feed-item';

export default (
  getEvents: GetEvents,
  renderFeedList: RenderFeedList,
  renderFollowToggle: RenderFollowToggle,
): RenderFeed => async (editorialCommunityId, userId) => {
  const events = await getEvents(editorialCommunityId);
  let content = '<p>It looks like this community hasn’t evaluated any articles yet. Try coming back later!</p>';
  if (events.length > 0) {
    content = await renderFeedList(events);
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
