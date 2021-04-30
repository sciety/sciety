import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
import { fetchSavedArticles } from './fetch-saved-articles';
import { followList } from './follow-list/follow-list';
import { GetAllEvents } from './follow-list/project-followed-group-ids';
import { Follows } from './follow-list/render-followed-group';
import { projectSavedArticleDois } from './project-saved-article-dois';
import { renderHeader, UserDetails } from './render-header';
import { renderErrorPage, renderPage } from './render-page';
import { renderSavedArticles } from './render-saved-articles';
import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type FetchGroup = (groupId: GroupId) => TO.TaskOption<{
  id: GroupId,
  name: string,
  avatarPath: string,
}>;

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
        followList: followList(ports)(params.id, viewingUserId),
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
      sequenceS(TE.ApplyPar),
      TE.bimap(renderErrorPage, renderPage),
    );
  };
};
