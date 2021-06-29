import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { followList, Ports as FollowListPorts } from './follow-list';
import { followedGroupIds } from './project-followed-group-ids';
import { tabs } from '../../shared-components/tabs';
import * as DE from '../../types/data-error';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { User } from '../../types/user';
import { UserId } from '../../types/user-id';
import { projectSavedArticleDois } from '../saved-articles-page/project-saved-article-dois';
import { tabList } from '../tab-list';
import { UserDetails } from '../user-details';
import { userPage } from '../user-page';

type GetUserDetails = (userId: UserId) => TE.TaskEither<DE.DataError, UserDetails>;

type Ports = FollowListPorts & {
  getUserDetails: GetUserDetails,
};

type Params = {
  id: UserId,
  user: O.Option<User>,
};

type FollowedGroupsPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const followedGroupsPage = (ports: Ports): FollowedGroupsPage => (params) => pipe(
  {
    dois: projectSavedArticleDois(ports.getAllEvents)(params.id),
    groupIds: followedGroupIds(ports.getAllEvents)(params.id),
  },
  sequenceS(T.ApplyPar),
  T.chain(({ dois, groupIds }) => pipe(
    {
      articleCount: T.of(dois.length),
      groupCount: T.of(groupIds.length),
      content: followList(ports)(groupIds),
    },
    sequenceS(T.ApplyPar),
  )),
  T.map(({ articleCount, groupCount, content }) => tabs({
    tabList: tabList(params.id, articleCount, groupCount),
    activeTabIndex: 1,
  })(content)),
  TE.rightTask,
  userPage(ports.getUserDetails(params.id)),
);
