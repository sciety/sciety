import { Context, Middleware, Next } from 'koa';
import showdown from 'showdown';
import createRenderPage, { GetHtml } from './render-page';

export type FetchStaticFile = (filename: string) => Promise<string>;

interface Ports {
  fetchStaticFile: FetchStaticFile;
}

export default (
  ports: Ports,
): Middleware => {
  const converter = new showdown.Converter({ noHeaderId: true });
  const getHtml: GetHtml = async (filename) => {
    const text = await ports.fetchStaticFile(filename);
    return converter.makeHtml(text);
  };
  const renderPage = createRenderPage(getHtml);
  return async ({ response }: Context, next: Next): Promise<void> => {
    response.body = await renderPage('about.md');
    await next();
  };
};
