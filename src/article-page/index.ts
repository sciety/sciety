import { Middleware, RouterContext } from '@koa/router';
import { NotFound } from 'http-errors';
import { Next } from 'koa';
import createFetchReviews from './fetch-reviews';
import createRenderArticleAbstract, { GetArticleAbstract, RenderArticleAbstract } from './render-article-abstract';
import createRenderPage from './render-page';
import validateBiorxivDoi from './validate-biorxiv-doi';
import Doi from '../data/doi';
import { Adapters } from '../types/adapters';

type GetFullArticle = (doi: Doi) => Promise<{
  abstract: string;
}>;

const buildRenderAbstract = (fetchAbstract: GetFullArticle): RenderArticleAbstract => {
  const abstractAdapter: GetArticleAbstract = async (articleDoi) => {
    const fetchedArticle = await fetchAbstract(articleDoi)
      .catch(() => {
        throw new NotFound(`${articleDoi} not found`);
      });
    return { content: fetchedArticle.abstract };
  };
  return createRenderArticleAbstract(abstractAdapter);
};

export default (adapters: Adapters): Middleware => {
  const fetchReviews = createFetchReviews(
    adapters.reviewReferenceRepository,
    adapters.fetchReview,
    adapters.editorialCommunities,
  );

  const renderAbstract = buildRenderAbstract(adapters.fetchArticle);
  const renderPage = createRenderPage(
    fetchReviews,
    adapters.editorialCommunities,
    adapters.getBiorxivCommentCount,
    adapters.fetchArticle,
    renderAbstract,
    adapters.reviewReferenceRepository,
  );
  return async (ctx: RouterContext, next: Next): Promise<void> => {
    const doi = validateBiorxivDoi(ctx.params.doi);
    ctx.response.body = await renderPage(doi);
    await next();
  };
};
