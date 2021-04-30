import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { flow } from 'fp-ts/function';
import { renderGroup } from './render-group';
import { GetAllGroups, renderGroups } from './render-groups';
import { renderPage } from './render-page';
import { renderPageHeader } from './render-page-header';
import { yourFeed, Ports as YourFeedPorts } from './your-feed';
import { renderFollowToggle } from '../follow/render-follow-toggle';
import { GroupId } from '../types/group-id';
import { Page } from '../types/page';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type Ports = YourFeedPorts & {
  getAllGroups: GetAllGroups,
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
    header: T.of(renderPageHeader()),
    feed: yourFeed(ports)(userId),
    editorialCommunities: renderGroups(
      ports.getAllGroups,
      renderGroup(renderFollowToggle, ports.follows),
    )(userId),
  }),
  sequenceS(T.ApplyPar),
  T.map(renderPage),
);
