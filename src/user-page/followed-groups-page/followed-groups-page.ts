import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { followList, Ports as FollowListPorts } from './follow-list';
import { tabs } from '../../shared-components/tabs';
import { toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { User } from '../../types/user';
import { UserId } from '../../types/user-id';
import { renderErrorPage } from '../render-error-page';
import { renderHeader, UserDetails } from '../render-header';
import { renderPage } from '../render-page';
import { tabList } from '../tab-list';

type GetUserDetails = (userId: UserId) => TE.TaskEither<'not-found' | 'unavailable', UserDetails>;

type Ports = FollowListPorts & {
  getUserDetails: GetUserDetails,
};

type Params = {
  id: UserId,
  user: O.Option<User>,
};

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
        TE.map((activeTabPanelContents) => tabs(tabList(params.id))(
          activeTabPanelContents,
          false,
        )),
      ),
    },
    sequenceS(TE.ApplyPar),
    TE.bimap(renderErrorPage, renderPage),
  );
};
