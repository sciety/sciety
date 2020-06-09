import { Middleware } from 'koa';
import createRenderSearchResults from './render-search-results';
import Doi from '../data/doi';
import { Adapters } from '../types/adapters';

export type GetJson = (uri: string) => Promise<object>;

const createRenderArticleSearchPage = (
  getJson: GetJson,
  fetchReviewReferences: (articleVersionDoi: Doi) => Array<unknown>,
) => async (query: string): Promise<string> => {
  const renderSearchResults = createRenderSearchResults(getJson, fetchReviewReferences);
  return `
    <h1 class="header">Search results</h1>
    ${await renderSearchResults(query)}
  `;
};

export default (adapters: Adapters): Middleware => {
  const renderArticleSearchPage = createRenderArticleSearchPage(
    adapters.getJson,
    adapters.reviewReferenceRepository.findReviewsForArticleVersionDoi,
  );
  return async (ctx, next) => {
    ctx.response.body = await renderArticleSearchPage(ctx.request.query.query);
    await next();
  };
};
