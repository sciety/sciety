import { sequenceS } from 'fp-ts/Apply';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { followList, Ports as FollowListPorts } from './follow-list/follow-list';
import { followedGroupIds } from './follow-list/project-followed-group-ids';
import { renderDescription } from './render-description';
import { renderErrorPage } from './render-error-page';
import { renderHeader } from './render-header';
import { renderPage } from './render-page';
import { tabList } from './tab-list';
import { UserDetails } from './user-details';
import { tabs } from '../shared-components/tabs';
import * as DE from '../types/data-error';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { UserId } from '../types/user-id';

type GetUserDetails = (userId: UserId) => TE.TaskEither<DE.DataError, UserDetails>;

type GetUserId = (handle: string) => TE.TaskEither<DE.DataError, UserId>;

// ts-unused-exports:disable-next-line
export type Ports = FollowListPorts & {
  getUserDetails: GetUserDetails,
  getUserId: GetUserId,
};

type Params = {
  handle: string,
};

const renderUserListCard = (handle: string) => toHtmlFragment(`
  <div class="list-card">
    <h3 class="list-card__title">
      <a href="/users/${handle}/lists/saved-articles" class="list-card__link">Saved articles</a>
    </h3>
  </div>
`);

type UserPage = (tab: string) => (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const userPage = (ports: Ports): UserPage => (tab) => (params) => pipe(
  params.handle,
  ports.getUserId, // TODO: get the user details (extended to include the id) from Twitter here instead
  TE.chain((id) => pipe(
    {
      groupIds: TE.rightTask(followedGroupIds(ports.getAllEvents)(id)),
      userDetails: ports.getUserDetails(id),
      activeTabIndex: TE.right(tab === 'lists' ? 0 as const : 1 as const),
      id: TE.right(id),
    },
    sequenceS(TE.ApplyPar),
  )),
  TE.chainTaskK((inputs) => pipe(
    (inputs.activeTabIndex === 0)
      ? T.of(renderUserListCard(inputs.userDetails.handle))
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
