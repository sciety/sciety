import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { fetchSavedArticles } from './fetch-saved-articles';
import { GetEditorialCommunity, getFollowedEditorialCommunitiesFromIds } from './get-followed-editorial-communities-from-ids';
import { getUserDisplayName } from './get-user-display-name';
import { GetAllEvents, projectFollowedEditorialCommunityIds } from './project-followed-editorial-community-ids';
import { projectSavedArticleDois } from './project-saved-article-dois';
import { renderFollowList } from './render-follow-list';
import { renderFollowToggle } from './render-follow-toggle';
import { Follows, renderFollowedEditorialCommunity } from './render-followed-editorial-community';
import { renderHeader, UserDetails } from './render-header';
import { Page, renderErrorPage, renderPage } from './render-page';
import { renderSavedArticles } from './render-saved-articles';
import { Doi } from '../types/doi';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';
import { User } from '../types/user';
import { toUserId, UserId } from '../types/user-id';

type FetchEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => T.Task<O.Option<{
  id: EditorialCommunityId,
  name: string,
  avatarPath: string,
}>>;

type GetUserDetails = (userId: UserId) => TE.TaskEither<'not-found' | 'unavailable', UserDetails>;

type Ports = {
  getEditorialCommunity: FetchEditorialCommunity,
  getAllEvents: GetAllEvents,
  follows: Follows,
  getUserDetails: GetUserDetails,
  fetchArticle: (doi: Doi) => TE.TaskEither<unknown, {title: HtmlFragment}>,
};

type Params = {
  id?: string,
  user: O.Option<User>,
};

type UserPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const userPage = (ports: Ports): UserPage => {
  const getEditorialCommunity: GetEditorialCommunity = (editorialCommunityId) => pipe(
    editorialCommunityId,
    ports.getEditorialCommunity,
  );

  const getFollowedEditorialCommunities = getFollowedEditorialCommunitiesFromIds(
    projectFollowedEditorialCommunityIds(ports.getAllEvents),
    getEditorialCommunity,
  );

  const getTitle = flow(
    ports.fetchArticle,
    T.map(O.fromEither),
    T.map(O.map((article) => article.title)),
  );

  return (params) => {
    const userId = toUserId(params.id ?? '');
    const viewingUserId = pipe(
      params.user,
      O.map((user) => user.id),
    );

    return pipe(
      {
        header: pipe(
          userId,
          ports.getUserDetails,
          TE.map(renderHeader),
        ),
        followList: renderFollowList(
          getFollowedEditorialCommunities,
          renderFollowedEditorialCommunity(renderFollowToggle, ports.follows),
        )(userId, viewingUserId),
        savedArticlesList: pipe(
          userId,
          projectSavedArticleDois(ports.getAllEvents),
          T.chain(fetchSavedArticles(getTitle)),
          T.map(renderSavedArticles),
          TE.rightTask,
        ),
        userDisplayName: pipe(
          userId,
          getUserDisplayName(ports.getUserDetails),
          TE.map(toHtmlFragment),
        ),
      },
      sequenceS(TE.taskEither),
      TE.bimap(renderErrorPage, renderPage),
    );
  };
};
