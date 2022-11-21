import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { followList, Ports as FollowListPorts } from './follow-list/follow-list';
import { renderDescription } from './render-description';
import { renderErrorPage } from './render-error-page';
import { renderHeader } from './render-header';
import { renderPage } from './render-page';
import { tabList } from './tab-list';
import { userListCard } from './user-list-card';
import { tabs } from '../shared-components/tabs';
import { SelectAllListsOwnedBy } from '../shared-ports';
import { GetUserDetails } from '../shared-ports/get-user-details';
import { getGroupIdsFollowedBy } from '../shared-read-models/followings';
import * as DE from '../types/data-error';
import { toHtmlFragment } from '../types/html-fragment';
import * as LOID from '../types/list-owner-id';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { UserId } from '../types/user-id';

type GetUserId = (handle: string) => TE.TaskEither<DE.DataError, UserId>;

type Ports = FollowListPorts & {
  getUserDetails: GetUserDetails,
  getUserId: GetUserId,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

type Params = {
  handle: string,
};

type UserPage = (tab: string) => (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const userPage = (ports: Ports): UserPage => (tab) => (params) => pipe(
  params.handle,
  ports.getUserId,
  TE.chain((userId) => pipe(
    {
      groupIds: pipe(
        ports.getAllEvents,
        T.map(getGroupIdsFollowedBy(userId)),
        TE.rightTask,
      ),
      userDetails: ports.getUserDetails(userId),
      activeTabIndex: TE.right(tab === 'lists' ? 0 as const : 1 as const),
      userId: TE.right(userId),
      list: pipe(
        userId,
        LOID.fromUserId,
        ports.selectAllListsOwnedBy,
        RA.head,
        E.fromOption(() => DE.notFound),
        T.of,
      ),
    },
    sequenceS(TE.ApplyPar),
  )),
  TE.chainTaskK((inputs) => pipe(
    (inputs.activeTabIndex === 0)
      ? T.of(userListCard(inputs.userDetails.handle, inputs.list))
      : followList(ports)(inputs.groupIds),
    T.map(tabs({
      tabList: tabList(inputs.userDetails.handle, inputs.groupIds.length),
      activeTabIndex: inputs.activeTabIndex,
    })),
    T.map((mainContent) => ({
      header: renderHeader(inputs.userDetails),
      userDisplayName: toHtmlFragment(inputs.userDetails.displayName),
      description: renderDescription(inputs.groupIds.length),
      mainContent,
    })),
  )),
  TE.bimap(renderErrorPage, renderPage),
);
