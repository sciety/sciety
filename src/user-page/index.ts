import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { fetchSavedArticles } from './fetch-saved-articles';
import { GetAllEvents, projectFollowedGroupIds } from './project-followed-group-ids';
import { projectSavedArticleDois } from './project-saved-article-dois';
import { renderFollowList } from './render-follow-list';
import { Follows, renderFollowedGroup } from './render-followed-group';
import { renderHeader, UserDetails } from './render-header';
import { renderErrorPage, renderPage } from './render-page';
import { renderSavedArticles } from './render-saved-articles';
import { renderFollowToggle } from '../follow/render-follow-toggle';
import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type FetchGroup = (groupId: GroupId) => T.Task<O.Option<{
  id: GroupId,
  name: string,
  avatarPath: string,
}>>;

type GetUserDetails = (userId: UserId) => TE.TaskEither<'not-found' | 'unavailable', UserDetails>;

type Ports = {
  getGroup: FetchGroup,
  getAllEvents: GetAllEvents,
  follows: Follows,
  getUserDetails: GetUserDetails,
  fetchArticle: (doi: Doi) => TE.TaskEither<unknown, { title: HtmlFragment }>,
};

type Params = {
  id: UserId,
  user: O.Option<User>,
};

type UserPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const userPage = (ports: Ports): UserPage => {
  const getTitle = flow(
    ports.fetchArticle,
    T.map(flow(
      O.fromEither,
      O.map((article) => article.title),
    )),
  );

  return (params) => {
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
        followList: pipe(
          params.id,
          projectFollowedGroupIds(ports.getAllEvents),
          T.chain(T.traverseArray(ports.getGroup)),
          T.chain(flow(
            RA.compact,
            T.traverseArray(renderFollowedGroup(renderFollowToggle, ports.follows)(viewingUserId)),
          )),
          T.map(renderFollowList),
          TE.rightTask,
        ),
        savedArticlesList: pipe(
          params.id,
          projectSavedArticleDois(ports.getAllEvents),
          T.chain(fetchSavedArticles(getTitle)),
          T.map(renderSavedArticles),
          TE.rightTask,
        ),
        userDisplayName: pipe(
          userDetails,
          TE.map(flow(
            ({ displayName }) => displayName,
            toHtmlFragment,
          )),
        ),
      },
      sequenceS(TE.taskEither),
      TE.bimap(renderErrorPage, renderPage),
    );
  };
};
