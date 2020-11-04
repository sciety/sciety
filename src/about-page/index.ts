import showdown from 'showdown';
import createRenderPage, { GetHtml, RenderPage } from './render-page';

export type FetchStaticFile = (filename: string) => Promise<string>;

interface Ports {
  fetchStaticFile: FetchStaticFile;
}

type AboutPage = () => ReturnType<RenderPage>;

export default (ports: Ports): AboutPage => {
  const converter = new showdown.Converter({ noHeaderId: true });
  const getHtml: GetHtml = async (filename) => {
    const text = await ports.fetchStaticFile(filename);
    return converter.makeHtml(text);
  };
  const renderPage = createRenderPage(getHtml);
  return async () => (
    renderPage('about.md')
  );
};
