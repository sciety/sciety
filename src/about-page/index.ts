import * as T from 'fp-ts/lib/Task';
import { Remarkable } from 'remarkable';
import createRenderPage, { GetHtml, RenderPage } from './render-page';

export type FetchStaticFile = (filename: string) => T.Task<string>;

interface Ports {
  fetchStaticFile: FetchStaticFile;
}

type AboutPage = () => ReturnType<RenderPage>;

export default (ports: Ports): AboutPage => {
  const remarkable = new Remarkable({ html: true });
  const getHtml: GetHtml = async (filename) => {
    const text = await ports.fetchStaticFile(filename)();
    return remarkable.render(text);
  };
  const renderPage = createRenderPage(getHtml);
  return async () => (
    renderPage('about.md')
  );
};
