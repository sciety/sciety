import * as T from 'fp-ts/lib/Task';
import { flow } from 'fp-ts/lib/function';
import { Remarkable } from 'remarkable';
import createRenderPage, { GetHtml, RenderPage } from './render-page';

export type FetchStaticFile = (filename: string) => T.Task<string>;

interface Ports {
  fetchStaticFile: FetchStaticFile;
}

type AboutPage = () => ReturnType<RenderPage>;

export default (ports: Ports): AboutPage => {
  const remarkable = new Remarkable({ html: true });
  const getHtml: GetHtml = flow(
    ports.fetchStaticFile,
    T.map((md: string) => remarkable.render(md)),
  );
  const renderPage = createRenderPage(getHtml);
  return async () => (
    renderPage('about.md')
  );
};
