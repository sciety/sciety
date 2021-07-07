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
import { GetAllEvents, projectSavedArticleDois } from './saved-articles/project-saved-article-dois';
import { savedArticles, Ports as SavedArticlesPorts } from './saved-articles/saved-articles';
import { tabList } from './tab-list';
import { UserDetails } from './user-details';
import { tabs } from '../shared-components/tabs';
import * as DE from '../types/data-error';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { toUserId, UserId } from '../types/user-id';

type GetUserDetails = (userId: UserId) => TE.TaskEither<DE.DataError, UserDetails>;

type GetUserId = (handle: string) => TE.TaskEither<DE.DataError, UserId>;

// ts-unused-exports:disable-next-line
export type Ports = SavedArticlesPorts & FollowListPorts & {
  getAllEvents: GetAllEvents,
  getUserDetails: GetUserDetails,
  getUserId: GetUserId,
};

type Params = {
  descriptor: string,
};

type UserPage = (tab: string) => (params: Params) => TE.TaskEither<RenderPageError, Page>;

const userIdFromDescriptor = (getUserId: GetUserId) => (descriptor: string) => pipe(
  descriptor.match(/^\d+$/) ? TE.right(toUserId(descriptor)) : getUserId(descriptor),
);

export const userPage = (ports: Ports): UserPage => (tab) => (params) => pipe(
  params.descriptor,
  userIdFromDescriptor(ports.getUserId),
  TE.chain((id) => pipe(
    {
      dois: TE.rightTask(projectSavedArticleDois(ports.getAllEvents)(id)),
      groupIds: TE.rightTask(followedGroupIds(ports.getAllEvents)(id)),
      userDetails: ports.getUserDetails(id),
      activeTabIndex: TE.right(tab === 'saved-articles' ? 0 as const : 1 as const),
      id: TE.right(id),
    },
    sequenceS(TE.ApplyPar),
  )),
  TE.chainTaskK((inputs) => pipe(
    (inputs.activeTabIndex === 0) ? savedArticles(ports)(inputs.dois) : followList(ports)(inputs.groupIds),
    T.map(tabs({
      tabList: tabList(inputs.id, inputs.dois.length, inputs.groupIds.length),
      activeTabIndex: inputs.activeTabIndex,
    })),
    T.map((mainContent) => ({
      header: renderHeader(inputs.userDetails),
      userDisplayName: toHtmlFragment(inputs.userDetails.displayName),
      description: renderDescription(inputs.dois.length, inputs.groupIds.length),
      mainContent,
    })),
  )),
  TE.bimap(renderErrorPage, renderPage),
);
