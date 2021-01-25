import { sequenceS } from 'fp-ts/lib/Apply';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { constant, flow, pipe } from 'fp-ts/lib/function';
import { ConstructFeedItem, FeedEvent } from './construct-feed-item';
import { RenderFollowToggle } from './render-follow-toggle';
import { FeedItem } from '../shared-components/render-summary-feed-list';
import { EditorialCommunity } from '../types/editorial-community';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type RenderFeed = (editorialCommunity: EditorialCommunity, userId: O.Option<UserId>)
=> T.Task<HtmlFragment>;

export type GetEvents = (editorialCommunityId: EditorialCommunityId) => T.Task<ReadonlyArray<FeedEvent>>;

export type RenderSummaryFeedList = (events: ReadonlyArray<FeedItem>) => O.Option<HtmlFragment>;

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

export default (
  getEvents: GetEvents,
  constructFeedItem: ConstructFeedItem,
  renderSummaryFeedList: RenderSummaryFeedList,
  renderFollowToggle: RenderFollowToggle,
): RenderFeed => (editorialCommunity, userId) => pipe(
  {
    button: renderFollowToggle(userId, editorialCommunity.id),
    feed: pipe(
      editorialCommunity.id,
      getEvents,
      T.chain(T.traverseArray(constructFeedItem)),
      T.map(flow(
        renderSummaryFeedList,
        O.getOrElse(constant(emptyFeed)),
        toHtmlFragment,
      )),
    ),
  },
  sequenceS(T.task),
  T.map(flow(
    renderAsSection,
    toHtmlFragment,
  )),
);
