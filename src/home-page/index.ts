import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { constant, flow, pipe } from 'fp-ts/function';
import { constructFeedItem, GetArticle } from './construct-feed-item';
import { getActor, GetGroup } from './get-actor';
import { GetAllEvents, getMostRecentEvents } from './get-most-recent-events';
import { projectIsFollowingSomething } from './project-is-following-something';
import { renderFeed } from './render-feed';
import { renderGroup } from './render-group';
import { GetAllGroups, renderGroups } from './render-groups';
import { renderPage, RenderPage } from './render-page';
import { renderPageHeader } from './render-page-header';
import { renderFollowToggle } from '../follow/render-follow-toggle';
import { renderSummaryFeedList } from '../shared-components';
import { GroupId } from '../types/group-id';
import { toHtmlFragment } from '../types/html-fragment';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type Ports = {
  fetchArticle: GetArticle,
  getAllGroups: GetAllGroups,
  getGroup: GetGroup,
  getAllEvents: GetAllEvents,
  follows: (u: UserId, g: GroupId) => T.Task<boolean>,
};

type Params = {
  user: O.Option<User>,
};

type HomePage = (params: Params) => ReturnType<RenderPage>;

export const homePage = (ports: Ports): HomePage => flow(
  (params) => params.user,
  O.map((user) => user.id),
  renderPage(
    renderPageHeader,
    renderGroups(
      ports.getAllGroups,
      renderGroup(renderFollowToggle, ports.follows),
    ),
    renderFeed(
      projectIsFollowingSomething(ports.getAllEvents),
      getMostRecentEvents(ports.getAllEvents, ports.follows, 20),
      flow(
        T.traverseArray(constructFeedItem(getActor(ports.getGroup), ports.fetchArticle)),
        T.map(RNEA.fromReadonlyArray), // TODO shouldn't be needed, fp-ts types needs fixing
        TO.match(constant(pipe('', toHtmlFragment)), renderSummaryFeedList),
      ),
    ),
  ),
);
