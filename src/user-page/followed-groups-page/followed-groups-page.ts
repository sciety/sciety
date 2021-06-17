import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { User } from '../../types/user';
import { UserId } from '../../types/user-id';
import { followList, Ports as FollowListPorts } from '../follow-list';
import { renderHeader, UserDetails } from '../render-header';
import { renderErrorPage, renderPage } from '../render-page';

type GetUserDetails = (userId: UserId) => TE.TaskEither<'not-found' | 'unavailable', UserDetails>;

type Ports = FollowListPorts & {
  getUserDetails: GetUserDetails,
};

type Params = {
  id: UserId,
  user: O.Option<User>,
};

type UserPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

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
      followList: followList(ports)(params.id, viewingUserId),
      savedArticles: TE.right(toHtmlFragment('')),
      userDisplayName: pipe(
        userDetails,
        TE.map(flow(
          ({ displayName }) => displayName,
          toHtmlFragment,
        )),
      ),
    },
    sequenceS(TE.ApplyPar),
    TE.bimap(renderErrorPage, renderPage),
  );
};
