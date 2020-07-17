import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import createRenderPage, { FetchArticle } from './render-page';
import { GetEditorialCommunities, GetReviewReferences } from './render-recent-activity';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import { FetchExternalArticle } from '../types/fetch-external-article';
import ReviewReferenceRepository from '../types/review-reference-repository';

interface Ports {
  fetchArticle: FetchExternalArticle;
  editorialCommunities: EditorialCommunityRepository;
  reviewReferenceRepository: ReviewReferenceRepository;
}

const raiseFetchArticleErrors = (fetchArticle: FetchExternalArticle): FetchArticle => (
  async (doi) => {
    const result = await fetchArticle(doi);
    return result.toMaybe();
  }
);

/* eslint-disable no-empty-pattern */
export type RenderPage = ({}) => Promise<string>;

export const buildRenderPage = (ports: Ports): RenderPage => {
  const reviewReferenceAdapter: GetReviewReferences = async () => Array.from(ports.reviewReferenceRepository);
  const editorialCommunitiesAdapter: GetEditorialCommunities = async () => ports.editorialCommunities.all();
  const renderPage = createRenderPage(
    reviewReferenceAdapter,
    raiseFetchArticleErrors(ports.fetchArticle),
    editorialCommunitiesAdapter,
  );
  return renderPage;
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
