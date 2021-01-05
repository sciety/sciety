import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { Result } from 'true-myth';
import { renderPage } from './render-page';
import { HtmlFragment } from '../types/html-fragment';

export type FetchStaticFile = (filename: string) => T.Task<string>;

interface Ports {
  fetchStaticFile: FetchStaticFile;
}

type AboutPage = T.Task<Result<{
  title: string,
  content: HtmlFragment,
}, never>>;

export default (ports: Ports): AboutPage => pipe(
  'about.md',
  ports.fetchStaticFile,
  T.map(renderPage),
  T.map((html) => Result.ok({
    title: 'About',
    content: html,
  })),
);
