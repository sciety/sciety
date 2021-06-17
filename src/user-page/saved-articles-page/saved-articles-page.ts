import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { UserId } from '../../types/user-id';
import { renderHeader, UserDetails } from '../render-header';
import { renderErrorPage } from '../render-page';

type GetUserDetails = (userId: UserId) => TE.TaskEither<'not-found' | 'unavailable', UserDetails>;

type Ports = {
  getUserDetails: GetUserDetails,
};

type Params = {
  id: UserId,
};

type SavedArticlesPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const savedArticlesPage = (ports: Ports): SavedArticlesPage => (params) => pipe(
  ports.getUserDetails(params.id),
  TE.map(renderHeader),
  TE.bimap(
    renderErrorPage,
    (header) => ({
      title: 'User\'s saved articles',
      content: toHtmlFragment(header),
    }),
  ),
);
