import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { followList, Ports as FollowListPorts } from './follow-list';
import { tabs } from '../../shared-components/tabs';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { User } from '../../types/user';
import { UserId } from '../../types/user-id';
import { renderErrorPage } from '../render-error-page';
import { renderHeader, UserDetails } from '../render-header';

type GetUserDetails = (userId: UserId) => TE.TaskEither<'not-found' | 'unavailable', UserDetails>;

type Ports = FollowListPorts & {
  getUserDetails: GetUserDetails,
};

type Params = {
  id: UserId,
  user: O.Option<User>,
};

type Components = {
  header: HtmlFragment,
  tabs: HtmlFragment,
  userDisplayName: string,
};

const renderPage = (components: Components) => (
  {
    title: components.userDisplayName,
    content: toHtmlFragment(`
      <div class="page-content__background">
        <div class="sciety-grid sciety-grid--user">
          ${components.header}

          <div class="main-content main-content--user">
            ${components.tabs}
          </div>
        </div>
      </div>
    `),
  }
);

type FollowedGroupsPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const followedGroupsPage = (ports: Ports): FollowedGroupsPage => (params) => {
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
      userDisplayName: pipe(
        userDetails,
        TE.map(flow(
          ({ displayName }) => displayName,
          toHtmlFragment,
        )),
      ),
      tabs: pipe(
        followList(ports)(params.id, viewingUserId),
        TE.map((activeTabPanelContents) => tabs(
          activeTabPanelContents,
          [
            { label: 'Saved articles', url: `/users/${params.id}/saved-articles` },
            { label: 'Followed groups', url: `/users/${params.id}/followed-groups` },
          ],
          false,
        )),
      ),
    },
    sequenceS(TE.ApplyPar),
    TE.bimap(renderErrorPage, renderPage),
  );
};
