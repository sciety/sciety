import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { constant, flow, pipe } from 'fp-ts/function';
import { ConstructFeedItem, FeedEvent } from './construct-feed-item';
import { FeedItem } from '../shared-components';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderFeed = (group: Group)
=> T.Task<HtmlFragment>;

export type GetEvents = (groupId: GroupId) => T.Task<ReadonlyArray<FeedEvent>>;

type RenderSummaryFeedList = (events: ReadonlyArray<FeedItem>) => O.Option<HtmlFragment>;

const emptyFeed = `
  <p>
    It looks like this group hasn’t evaluated any articles yet. Try coming back later!
  </p>
`;

export const renderFeed = (
  getEvents: GetEvents,
  constructFeedItem: ConstructFeedItem,
  renderSummaryFeedList: RenderSummaryFeedList,
): RenderFeed => (group) => pipe(
  group.id,
  getEvents,
  T.chain(T.traverseArray(constructFeedItem(group))),
  T.map(flow(
    renderSummaryFeedList,
    O.getOrElse(constant(emptyFeed)),
    toHtmlFragment,
  )),
);
