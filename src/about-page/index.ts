import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderPage } from './render-page';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type FetchStaticFile = (filename: string) => TE.TaskEither<'not-found' | 'unavailable', string>;

type Ports = {
  fetchStaticFile: FetchStaticFile,
};

type AboutPage = () => TE.TaskEither<RenderPageError, Page>;

export const aboutPage = (ports: Ports): AboutPage => () => pipe(
  'about.md',
  ports.fetchStaticFile,
  TE.map(renderPage),
  TE.bimap(
    () => ({
      type: 'unavailable',
      message: toHtmlFragment('We couldn\'t find this information; please try again later.'),
    }),
    (content) => ({
      title: 'About',
      content,
    }),
  ),
);
