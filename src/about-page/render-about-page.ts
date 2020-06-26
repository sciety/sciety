import { Context, Middleware, Next } from 'koa';
import showdown from 'showdown';
import createRenderPage, { GetHtml } from './render-page';
import { FetchStaticFile } from '../infrastructure/fetch-static-file';

export default (
  fetchStaticFile: FetchStaticFile,
): Middleware => {
  const converter = new showdown.Converter({ noHeaderId: true });
  return async ({ response }: Context, next: Next): Promise<void> => {
    const getHtml: GetHtml = async (filename) => {
      const text: string = await fetchStaticFile(filename);
      return converter.makeHtml(text);
    };
    const renderPage = createRenderPage(getHtml);
    response.body = await renderPage('about.md');
    await next();
  };
};
