import { sequenceS } from 'fp-ts/lib/Apply';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { constant, flow, pipe } from 'fp-ts/lib/function';
import { RenderFollowToggle } from './render-follow-toggle';
import EditorialCommunityId from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type RenderFeed = (editorialCommunityId: EditorialCommunityId, userId: O.Option<UserId>)
=> Promise<HtmlFragment>;

export type GetEvents<E> = (editorialCommunityId: EditorialCommunityId) => T.Task<ReadonlyArray<E>>;

type RenderSummaryFeedList<E> = (events: ReadonlyArray<E>) => T.Task<O.Option<string>>;

const emptyFeed = `
  <p>
    It looks like this community hasn’t evaluated any articles yet. Try coming back later!
  </p>
`;

type ViewModel = {
  button: HtmlFragment,
  feed: HtmlFragment,
};

const renderAsSection = (viewModel: ViewModel): string => `
  <section>
    <h2>
      Feed
    </h2>
    ${viewModel.button}
    ${viewModel.feed}
  </section>
`;

export default <E>(
  getEvents: GetEvents<E>,
  renderSummaryFeedList: RenderSummaryFeedList<E>,
  renderFollowToggle: RenderFollowToggle,
): RenderFeed => async (editorialCommunityId, userId) => pipe(
  {
    button: renderFollowToggle(userId, editorialCommunityId),
    feed: pipe(
      editorialCommunityId,
      getEvents,
      T.chain(renderSummaryFeedList),
      T.map(O.getOrElse(constant(emptyFeed))),
      T.map(toHtmlFragment),
    ),
  },
  sequenceS(T.task),
  T.map(flow(
    renderAsSection,
    toHtmlFragment,
  )),
)();
