import { Maybe } from 'true-myth';
import { RenderFollowToggle } from './render-follow-toggle';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

export type RenderFeed = (editorialCommunityId: EditorialCommunityId, userId: Maybe<UserId>) => Promise<string>;

export type GetEvents<T> = (editorialCommunityId: EditorialCommunityId) => Promise<Array<T>>;

type RenderSummaryFeedList<T> = (events: ReadonlyArray<T>) => Promise<Maybe<string>>;

const emptyFeed = `
  <p>
    It looks like this community hasn’t evaluated any articles yet. Try coming back later!
  </p>
`;

export default <T>(
  getEvents: GetEvents<T>,
  renderSummaryFeedList: RenderSummaryFeedList<T>,
  renderFollowToggle: RenderFollowToggle,
): RenderFeed => async (editorialCommunityId, userId) => {
  const events = await getEvents(editorialCommunityId);
  return `
      <section class="ui very padded vertical segment">
        <h2>
          Feed
        </h2>
        ${await renderFollowToggle(userId, editorialCommunityId)}
        ${(await renderSummaryFeedList(events)).unwrapOr(emptyFeed)}
      </section>
    `;
};
