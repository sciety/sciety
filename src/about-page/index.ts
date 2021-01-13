import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { renderPage } from './render-page';
import { HtmlFragment } from '../types/html-fragment';

export type FetchStaticFile = (filename: string) => T.Task<string>;

interface Ports {
  fetchStaticFile: FetchStaticFile;
}

type AboutPage = () => T.Task<{
  title: string,
  content: HtmlFragment,
}>;

export default (ports: Ports): AboutPage => () => pipe(
  'about.md',
  ports.fetchStaticFile,
  T.map(renderPage),
  T.map((html) => ({
    title: 'About',
    content: html,
  })),
);
