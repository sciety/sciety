import * as RTE from 'fp-ts/ReaderTaskEither';
import * as TE from 'fp-ts/TaskEither';
import { flow } from 'fp-ts/function';
import { renderPage } from './render-page';
import * as DE from '../types/data-error';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type FetchStaticFile = (filename: string) => TE.TaskEither<DE.DataError, string>;

type AboutPage = RTE.ReaderTaskEither<FetchStaticFile, RenderPageError, Page>;

export const aboutPage: AboutPage = flow(
  (fetchStaticFile) => fetchStaticFile('about.md'),
  TE.map(renderPage),
  TE.bimap(
    () => ({
      type: DE.unavailable,
      message: toHtmlFragment('We couldn\'t find this information; please try again later.'),
    }),
    (content) => ({
      title: 'About',
      content,
    }),
  ),
);
