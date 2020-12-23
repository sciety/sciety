import * as T from 'fp-ts/lib/Task';
import { flow, pipe } from 'fp-ts/lib/function';
import { Remarkable } from 'remarkable';
import renderPage, { RenderPage } from './render-page';

export type FetchStaticFile = (filename: string) => T.Task<string>;

interface Ports {
  fetchStaticFile: FetchStaticFile;
}

type AboutPage = ReturnType<RenderPage>;

export default (ports: Ports): AboutPage => pipe(
  'about.md',
  renderPage(
    flow(
      ports.fetchStaticFile,
      T.map((md: string) => new Remarkable({ html: true }).render(md)),
    ),
  ),
);
