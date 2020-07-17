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

export default (ports: Ports): RenderPage => {
  const reviewReferenceAdapter: GetReviewReferences = async () => Array.from(ports.reviewReferenceRepository);
  const editorialCommunitiesAdapter: GetEditorialCommunities = async () => ports.editorialCommunities.all();
  const renderPage = createRenderPage(
    reviewReferenceAdapter,
    raiseFetchArticleErrors(ports.fetchArticle),
    editorialCommunitiesAdapter,
  );
  return renderPage;
};
