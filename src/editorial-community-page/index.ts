import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import createRenderPage, { FetchArticle } from './render-page';
import { Adapters } from '../types/adapters';

const raiseFetchArticleErrors = (fetchArticle: Adapters['fetchArticle']): FetchArticle => (
  async (doi) => {
    const result = await fetchArticle(doi);

    return result.unsafelyUnwrap();
  }
);

// there should be a clean separation between:
// - knowledge of Koa
// - creation of page and its adapters
export default (adapters: Adapters): Middleware => {
  const renderPage = createRenderPage(
    raiseFetchArticleErrors(adapters.fetchArticle),
    adapters.reviewReferenceRepository,
    adapters.editorialCommunities,
  );

  return async (ctx: RouterContext, next: Next): Promise<void> => {
    ctx.response.body = await renderPage(ctx.params.id);

    await next();
  };
};
