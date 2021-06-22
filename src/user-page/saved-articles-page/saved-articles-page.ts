import { sequenceS } from 'fp-ts/Apply';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { savedArticles, Ports as SavedArticlesPorts } from './saved-articles';
import { tabs } from '../../shared-components/tabs';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { UserId } from '../../types/user-id';
import { renderErrorPage } from '../render-error-page';
import { renderHeader, UserDetails } from '../render-header';

type GetUserDetails = (userId: UserId) => TE.TaskEither<'not-found' | 'unavailable', UserDetails>;

type Ports = SavedArticlesPorts & {
  getUserDetails: GetUserDetails,
};

type Params = {
  id: UserId,
};

type Components = {
  header: HtmlFragment,
  tabs: HtmlFragment,
  userDisplayName: string,
};

const renderPage = (components: Components) => ({
  title: components.userDisplayName,
  content: toHtmlFragment(`
    <div class="page-content__background">
      <article class="sciety-grid sciety-grid--user">
        ${components.header}

        <div class="main-content main-content--user">
          ${components.tabs}
        </div>

      </article>
    </div>
  `),
});

type SavedArticlesPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const savedArticlesPage = (ports: Ports): SavedArticlesPage => (params) => pipe(
  ports.getUserDetails(params.id),
  (userDetails) => ({
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
      savedArticles(ports)(params.id),
      TE.map((activeTabPanelContents) => tabs(
        activeTabPanelContents,
        [
          { label: 'Saved articles', url: `/users/${params.id}/saved-articles` },
          { label: 'Followed groups', url: `/users/${params.id}/followed-groups` },
        ],
        true,
      )),

    ),
  }),
  sequenceS(TE.ApplyPar),
  TE.bimap(renderErrorPage, renderPage),
);
