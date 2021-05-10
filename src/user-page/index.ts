import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { fetchSavedArticles } from './fetch-saved-articles';
import { followList, Ports as FollowListPorts } from './follow-list';
import { GetAllEvents, projectSavedArticleDois } from './project-saved-article-dois';
import { renderHeader, UserDetails } from './render-header';
import { renderErrorPage, renderPage } from './render-page';
import { renderSavedArticles } from './render-saved-articles';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type FetchArticle = (doi: Doi) => TE.TaskEither<unknown, { title: HtmlFragment }>;

const getTitle = (fetchArticle: FetchArticle) => flow(
  fetchArticle,
  T.map(flow(
    O.fromEither,
    O.map((article) => article.title),
  )),
);

type GetUserDetails = (userId: UserId) => TE.TaskEither<'not-found' | 'unavailable', UserDetails>;

type Ports = FollowListPorts & {
  getAllEvents: GetAllEvents,
  getUserDetails: GetUserDetails,
  fetchArticle: FetchArticle,
};

type Params = {
  id: UserId,
  user: O.Option<User>,
};

type UserPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const userPage = (ports: Ports): UserPage => (params) => {
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
        T.chain(fetchSavedArticles(getTitle(ports.fetchArticle))),
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
