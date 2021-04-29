import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { constant, flow, pipe } from 'fp-ts/function';
import { constructFeedItem, GetArticle } from './construct-feed-item';
import { getActor, GetGroup } from './get-actor';
import { GetAllEvents, getMostRecentEvents } from './get-most-recent-events';
import { renderGroup } from './render-group';
import { GetAllGroups, renderGroups } from './render-groups';
import { renderPage } from './render-page';
import { renderPageHeader } from './render-page-header';
import { projectIsFollowingSomething } from './your-feed/project-is-following-something';
import { renderFeed } from './your-feed/render-feed';
import { renderFollowToggle } from '../follow/render-follow-toggle';
import { renderSummaryFeedList } from '../shared-components';
import { GroupId } from '../types/group-id';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
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

type HomePage = (params: Params) => T.Task<Page>;

export const homePage = (ports: Ports): HomePage => flow(
  (params) => params.user,
  O.map((user) => user.id),
  (userId) => ({
    header: renderPageHeader(),
    feed: renderFeed(
      projectIsFollowingSomething(ports.getAllEvents),
      getMostRecentEvents(ports.getAllEvents, ports.follows, 20),
      flow(
        T.traverseArray(constructFeedItem(getActor(ports.getGroup), ports.fetchArticle)),
        T.map(RNEA.fromReadonlyArray), // TODO shouldn't be needed, fp-ts types needs fixing
        TO.match(constant(pipe('', toHtmlFragment)), renderSummaryFeedList),
      ),
    )(userId, []),
    editorialCommunities: renderGroups(
      ports.getAllGroups,
      renderGroup(renderFollowToggle, ports.follows),
    )(userId),
  }),
  sequenceS(T.ApplyPar),
  T.map(renderPage),
);
