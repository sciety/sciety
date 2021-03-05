import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { ConstructFeedItem, FeedEvent } from './construct-feed-item';
import { RenderFollowToggle } from './render-follow-toggle';
import { FeedItem } from '../shared-components';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type RenderFeed = (group: Group, userId: O.Option<UserId>)
=> TE.TaskEither<never, HtmlFragment>;

export type GetEvents = (groupId: GroupId) => T.Task<ReadonlyArray<FeedEvent>>;

type RenderSummaryFeedList = (events: ReadonlyArray<FeedItem>) => O.Option<HtmlFragment>;

const emptyFeed = `
  <p>
    It looks like this group hasn’t evaluated any articles yet. Try coming back later!
  </p>
`;

type ViewModel = {
  button: HtmlFragment,
  feed: HtmlFragment,
};

const renderAsSection = (viewModel: ViewModel) => `
  <section>
    <h2>
      Feed
    </h2>
    ${viewModel.button}
    ${viewModel.feed}
  </section>
`;

export const renderFeed = (
  getEvents: GetEvents,
  constructFeedItem: ConstructFeedItem,
  renderSummaryFeedList: RenderSummaryFeedList,
  renderFollowToggle: RenderFollowToggle,
): RenderFeed => (group, userId) => pipe(
  {
    button: renderFollowToggle(userId, group.id),
    feed: pipe(
      group.id,
      getEvents,
      T.chain(T.traverseArray(constructFeedItem(group))),
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
  TE.rightTask,
);
