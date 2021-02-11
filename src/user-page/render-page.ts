import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';
import { UserId } from '../types/user-id';

type Page = {
  title: string,
  content: HtmlFragment,
};

export type RenderPage = (userId: UserId, viewingUserId: O.Option<UserId>) => TE.TaskEither<RenderPageError, Page>;

type Component = (userId: UserId, viewingUserId: O.Option<UserId>) => TE.TaskEither<'not-found' | 'unavailable', HtmlFragment>;

type Components = {
  header: HtmlFragment,
  followList: HtmlFragment,
  userDisplayName: string,
  savedArticlesList: HtmlFragment,
};

const template = ({
  header, followList, savedArticlesList, userDisplayName,
}: Components): Page => (
  {
    title: `${userDisplayName}`,
    content: toHtmlFragment(`
      <div class="sciety-grid sciety-grid--user">
        ${header}
        <div class="user-page-contents">
          ${followList}
          ${savedArticlesList}
        </div>
      </div>
    `),
  }
);

const renderErrorPage = (e: 'not-found' | 'unavailable'): RenderPageError => {
  if (e === 'not-found') {
    return {
      type: 'not-found',
      message: toHtmlFragment('User not found'),
    };
  }
  return {
    type: 'unavailable',
    message: toHtmlFragment('User information unavailable'),
  };
};

type GetUserDisplayName = (userId: UserId) => TE.TaskEither<'not-found' | 'unavailable', string>;

export const renderPage = (
  renderHeader: Component,
  renderFollowList: Component,
  getUserDisplayName: GetUserDisplayName,
  renderSavedArticles: Component,
): RenderPage => (userId, viewingUserId) => pipe(
  {
    header: renderHeader(userId, viewingUserId),
    followList: renderFollowList(userId, viewingUserId),
    userDisplayName: pipe(userId, getUserDisplayName, TE.map(toHtmlFragment)),
    savedArticlesList: renderSavedArticles(userId, viewingUserId),
  },
  sequenceS(TE.taskEither),
  TE.bimap(renderErrorPage, template),
);
