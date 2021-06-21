import { sequenceS } from 'fp-ts/Apply';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { savedArticles, Ports as SavedArticlesPorts } from './saved-articles';
import { tabs } from '../../shared-components/tabs';
import { toHtmlFragment } from '../../types/html-fragment';

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

type SavedArticlesPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const savedArticlesPage = (ports: Ports): SavedArticlesPage => (params) => pipe(
  {
    header: pipe(
      ports.getUserDetails(params.id),
      TE.map(renderHeader),
    ),
    savedArticles: savedArticles(ports)(params.id),
  },
  sequenceS(TE.ApplyPar),
  TE.bimap(
    renderErrorPage,
    (components) => ({
      title: 'User\'s saved articles',
      content: toHtmlFragment(`
        <div class="page-content__background">
          <article class="sciety-grid sciety-grid--user">
            ${components.header}

            <div class="main-content main-content--user">
              ${tabs(
        components.savedArticles,
        `/users/${params.id}/followed-groups`,
        'Saved articles',
      )}
            </div>

          </article>
        </div>
      `),
    }),
  ),
);
