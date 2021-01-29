import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { renderPage } from './render-page';
import { HtmlFragment } from '../types/html-fragment';

export type FetchStaticFile = (filename: string) => T.Task<string>;

type Ports = {
  fetchStaticFile: FetchStaticFile,
};

type AboutPage = () => T.Task<{
  title: string,
  content: HtmlFragment,
}>;

export const aboutPage = (ports: Ports): AboutPage => () => pipe(
  'about.md',
  ports.fetchStaticFile,
  T.map(renderPage),
  T.map((html) => ({
    title: 'About',
    content: html,
  })),
);
