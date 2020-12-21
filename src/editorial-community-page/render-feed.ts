import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { RenderFollowToggle } from './render-follow-toggle';
import EditorialCommunityId from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type RenderFeed = (editorialCommunityId: EditorialCommunityId, userId: O.Option<UserId>)
=> Promise<HtmlFragment>;

export type GetEvents<E> = (editorialCommunityId: EditorialCommunityId) => T.Task<ReadonlyArray<E>>;

type RenderSummaryFeedList<E> = (events: ReadonlyArray<E>) => Promise<O.Option<string>>;

const emptyFeed = `
  <p>
    It looks like this community hasn’t evaluated any articles yet. Try coming back later!
  </p>
`;

export default <E>(
  getEvents: GetEvents<E>,
  renderSummaryFeedList: RenderSummaryFeedList<E>,
  renderFollowToggle: RenderFollowToggle,
): RenderFeed => async (editorialCommunityId, userId) => {
  const events = await getEvents(editorialCommunityId)();
  return toHtmlFragment(`
    <section>
      <h2>
        Feed
      </h2>
      ${await renderFollowToggle(userId, editorialCommunityId)()}
      ${toHtmlFragment(O.getOrElse(() => emptyFeed)(await renderSummaryFeedList(events)))}
    </section>
  `);
};
