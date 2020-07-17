import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import showdown from 'showdown';
import createRenderPage, { GetHtml } from './render-page';

export type FetchStaticFile = (filename: string) => Promise<string>;

interface Ports {
  fetchStaticFile: FetchStaticFile;
}

/* eslint-disable no-empty-pattern */
export type RenderPage = ({}) => Promise<string>;

export const buildRenderPage = (ports: Ports): RenderPage => {
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

export default (ports: Ports): Middleware => {
  const renderPage = buildRenderPage(ports);
  return async (ctx: RouterContext, next: Next): Promise<void> => {
    const params = {
      ...ctx.params,
      ...ctx.query,
    };
    ctx.response.body = await renderPage(params);
    await next();
  };
};
