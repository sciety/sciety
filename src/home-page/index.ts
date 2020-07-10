import { Middleware } from '@koa/router';
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

export default (ports: Ports): Middleware => {
  const reviewReferenceAdapter: GetReviewReferences = async () => Array.from(ports.reviewReferenceRepository);
  const editorialCommunitiesAdapter: GetEditorialCommunities = async () => ports.editorialCommunities.all();
  const renderPage = createRenderPage(
    reviewReferenceAdapter,
    raiseFetchArticleErrors(ports.fetchArticle),
    editorialCommunitiesAdapter,
  );
  return async (ctx, next) => {
    ctx.response.body = await renderPage();
    await next();
  };
};
