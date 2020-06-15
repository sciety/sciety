import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import createRenderPage from './render-page';
import { Adapters } from '../types/adapters';

export default (adapters: Adapters): Middleware => {
  const renderPage = createRenderPage(
    adapters.fetchArticle,
    adapters.reviewReferenceRepository,
    adapters.editorialCommunities,
  );

  return async (ctx: RouterContext, next: Next): Promise<void> => {
    ctx.response.body = await renderPage(ctx.params.id);

    await next();
  };
};
