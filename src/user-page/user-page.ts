import { sequenceS } from 'fp-ts/Apply';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { renderErrorPage } from './render-error-page';
import { renderHeader } from './render-header';
import { renderPage } from './render-page';
import { UserDetails } from './user-details';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type UserPage = (
  userDetails: TE.TaskEither<'not-found' | 'unavailable', UserDetails>,
) => (
  tabs_: TE.TaskEither<never, HtmlFragment>,
) => TE.TaskEither<RenderPageError, Page>;

export const userPage: UserPage = (userDetails) => flow(
  (tabs) => ({
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
    tabs,
  }),
  sequenceS(TE.ApplyPar),
  TE.bimap(renderErrorPage, renderPage),
);
