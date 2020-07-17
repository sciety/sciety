import showdown from 'showdown';
import createRenderPage, { GetHtml } from './render-page';

export type FetchStaticFile = (filename: string) => Promise<string>;

interface Ports {
  fetchStaticFile: FetchStaticFile;
}

/* eslint-disable no-empty-pattern */
export type RenderPage = ({}) => Promise<string>;

export default (ports: Ports): RenderPage => {
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
