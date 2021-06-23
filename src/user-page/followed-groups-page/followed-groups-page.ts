import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { followList, Ports as FollowListPorts } from './follow-list';
import { tabs } from '../../shared-components/tabs';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { User } from '../../types/user';
import { UserId } from '../../types/user-id';
import { tabList } from '../tab-list';
import { UserDetails } from '../user-details';
import { userPage } from '../user-page';

type GetUserDetails = (userId: UserId) => TE.TaskEither<'not-found' | 'unavailable', UserDetails>;

type Ports = FollowListPorts & {
  getUserDetails: GetUserDetails,
};

type Params = {
  id: UserId,
  user: O.Option<User>,
};

type FollowedGroupsPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const followedGroupsPage = (ports: Ports): FollowedGroupsPage => (params) => pipe(
  followList(ports)(params.id, pipe(
    params.user,
    O.map((user) => user.id),
  )),
  TE.map(tabs({ tabList: tabList(params.id), activeTabIndex: 1 })),
  userPage(ports.getUserDetails(params.id)),
);
