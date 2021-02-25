import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderErrorPage, renderPage } from './render-page';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

export type FetchStaticFile = (filename: string) => TE.TaskEither<'not-found' | 'unavailable', string>;

type Ports = {
  fetchStaticFile: FetchStaticFile,
};

type AboutPage = () => TE.TaskEither<RenderPageError, Page>;

export const aboutPage = (ports: Ports): AboutPage => () => pipe(
  'about.md',
  ports.fetchStaticFile,
  TE.bimap(renderErrorPage, renderPage),
);
