import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { constant, flow, pipe } from 'fp-ts/function';
import { constructFeedItem, GetArticle } from './construct-feed-item';
import { getActor, GetGroup } from './get-actor';
import { GetAllEvents, getMostRecentEvents } from './get-most-recent-events';
import { projectIsFollowingSomething } from './project-is-following-something';
import { RenderFeed, renderFeed } from './render-feed';
import { renderSummaryFeedList } from '../../shared-components';
import { GroupId } from '../../types/group-id';
import { toHtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';

export type Ports = {
  fetchArticle: GetArticle,
  getGroup: GetGroup,
  getAllEvents: GetAllEvents,
  follows: (u: UserId, g: GroupId) => T.Task<boolean>,
};

type YourFeed = (ports: Ports) => RenderFeed;

export const yourFeed: YourFeed = (ports) => renderFeed(
  projectIsFollowingSomething(ports.getAllEvents),
  getMostRecentEvents(ports.getAllEvents, ports.follows, 20),
  flow(
    T.traverseArray(constructFeedItem(getActor(ports.getGroup), ports.fetchArticle)),
    T.map(RNEA.fromReadonlyArray), // TODO shouldn't be needed, fp-ts types needs fixing
    TO.match(constant(pipe('', toHtmlFragment)), renderSummaryFeedList),
  ),
);
