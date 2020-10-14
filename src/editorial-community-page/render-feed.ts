import { Maybe } from 'true-myth';
import { RenderFollowToggle } from './render-follow-toggle';
import { FeedEvent, RenderSummaryFeedList } from '../templates/render-summary-feed-list';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

export type RenderFeed = (editorialCommunityId: EditorialCommunityId, userId: Maybe<UserId>) => Promise<string>;

export type GetEvents = (editorialCommunityId: EditorialCommunityId) => Promise<Array<FeedEvent>>;

export { FeedEvent } from '../templates/render-summary-feed-list';

export default (
  getEvents: GetEvents,
  renderSummaryFeedList: RenderSummaryFeedList<FeedEvent>,
  renderFollowToggle: RenderFollowToggle,
): RenderFeed => async (editorialCommunityId, userId) => {
  const events = await getEvents(editorialCommunityId);
  let content = '<p>It looks like this community hasn’t evaluated any articles yet. Try coming back later!</p>';
  if (events.length > 0) {
    content = await renderSummaryFeedList(events);
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
