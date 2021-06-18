import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { followList, Ports as FollowListPorts } from './follow-list';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { User } from '../../types/user';
import { UserId } from '../../types/user-id';
import { renderHeader, UserDetails } from '../render-header';
import { renderErrorPage } from '../render-page';

type GetUserDetails = (userId: UserId) => TE.TaskEither<'not-found' | 'unavailable', UserDetails>;

type Ports = FollowListPorts & {
  getUserDetails: GetUserDetails,
};

type Params = {
  id: UserId,
  user: O.Option<User>,
};

type UserPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

type Tabs = {
  userId: UserId,
  availableArticleMatches: number,
  availableGroupMatches: number,
};

const tabsWithGroupsActive = (tabs: Tabs) => `
  <a href="/users/${tabs.userId}/saved-articles" class="user-page-tab user-page-tab--link">Saved articles </a>
  <h3 class="user-page-tab user-page-tab--heading"><span class="visually-hidden">Currently showing </span>Followed groups</h3>
`;

const categoryTabs = (tabs: Tabs) => `
  <h2 class="visually-hidden">Things this user finds useful</h2>
  <div class="user-page-tabs-container">
    ${tabsWithGroupsActive(tabs)}
  </div>
`;

type Components = {
  header: HtmlFragment,
  followedGroups: HtmlFragment,
  userDisplayName: string,
  tabs: string,
};

const renderPage = ({
  header, followedGroups, userDisplayName, tabs,
}: Components) => (
  {
    title: userDisplayName,
    content: toHtmlFragment(`
      <div class="page-content__background">
        <div class="sciety-grid sciety-grid--user">
          ${header}
          ${tabs}
          <div class="main-content main-content--user">
            ${followedGroups}
          </div>
        </div>
      </div>
    `),
  }
);

export const followedGroupsPage = (ports: Ports): UserPage => (params) => {
  const viewingUserId = pipe(
    params.user,
    O.map((user) => user.id),
  );
  const userDetails = ports.getUserDetails(params.id);

  return pipe(
    {
      header: pipe(
        userDetails,
        TE.map(renderHeader),
      ),
      followedGroups: followList(ports)(params.id, viewingUserId),
      userDisplayName: pipe(
        userDetails,
        TE.map(flow(
          ({ displayName }) => displayName,
          toHtmlFragment,
        )),
      ),
      tabs: TE.right(categoryTabs({
        userId: params.id,
        availableArticleMatches: 0,
        availableGroupMatches: 0,
      })),
    },
    sequenceS(TE.ApplyPar),
    TE.bimap(renderErrorPage, renderPage),
  );
};
