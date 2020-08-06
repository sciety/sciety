import { NotFound } from 'http-errors';
import { Result } from 'true-myth';
import createRenderDescription, { GetEditorialCommunityDescription, RenderDescription } from './render-description';
import createRenderEndorsedArticles, { GetNumberOfEndorsedArticles, RenderEndorsedArticles } from './render-endorsed-articles';
import createRenderPage from './render-page';
import createRenderPageHeader, { GetEditorialCommunity, RenderPageHeader } from './render-page-header';
import createRenderReviews, { GetNumberOfReviews, RenderReviews } from './render-reviews';
import EditorialCommunityId from '../types/editorial-community-id';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import EndorsementsRepository from '../types/endorsements-repository';
import ReviewReferenceRepository from '../types/review-reference-repository';

interface Ports {
  editorialCommunities: EditorialCommunityRepository;
  endorsements: EndorsementsRepository,
  reviewReferenceRepository: ReviewReferenceRepository;
}

const buildRenderPageHeader = (editorialCommunities: EditorialCommunityRepository): RenderPageHeader => {
  const getEditorialCommunity: GetEditorialCommunity = async (editorialCommunityId) => {
    const editorialCommunity = (await editorialCommunities.lookup(editorialCommunityId))
      .unwrapOrElse(() => {
        throw new NotFound(`${editorialCommunityId.value} not found`);
      });
    return editorialCommunity;
  };
  return createRenderPageHeader(getEditorialCommunity);
};

const buildRenderDescription = (editorialCommunities: EditorialCommunityRepository): RenderDescription => {
  const getEditorialCommunityDescription: GetEditorialCommunityDescription = async (editorialCommunityId) => {
    const editorialCommunity = (await editorialCommunities.lookup(editorialCommunityId))
      .unwrapOrElse(() => {
        throw new NotFound(`${editorialCommunityId.value} not found`);
      });
    return editorialCommunity.description;
  };
  return createRenderDescription(getEditorialCommunityDescription);
};

const buildRenderEndorsedArticles = (
  endorsements: EndorsementsRepository,
): RenderEndorsedArticles => {
  const getNumberOfEndorsedArticles: GetNumberOfEndorsedArticles = async (editorialCommunityId) => (
    (await endorsements.endorsedBy(editorialCommunityId)).length
  );
  return createRenderEndorsedArticles(getNumberOfEndorsedArticles);
};

const buildRenderReviews = (
  reviewReferenceRepository: ReviewReferenceRepository,
): RenderReviews => {
  const getNumberOfReviews: GetNumberOfReviews = async (editorialCommunityId) => (
    (await reviewReferenceRepository.findReviewsForEditorialCommunityId(editorialCommunityId)).length
  );
  return createRenderReviews(getNumberOfReviews);
};

interface Params {
  id?: string;
}

export type RenderPageError = {
  type: 'not-found',
  content: string,
};

export type RenderPage = (params: Params) => Promise<Result<string, RenderPageError>>;

export default (ports: Ports): RenderPage => {
  const renderPageHeader = buildRenderPageHeader(ports.editorialCommunities);
  const renderDescription = buildRenderDescription(ports.editorialCommunities);
  const renderEndorsedArticles = buildRenderEndorsedArticles(ports.endorsements);
  const renderReviews = buildRenderReviews(ports.reviewReferenceRepository);
  const renderPage = createRenderPage(
    renderPageHeader,
    renderDescription,
    renderEndorsedArticles,
    renderReviews,
  );
  return async (params) => {
    const editorialCommunityId = new EditorialCommunityId(params.id ?? '');
    try {
      return Result.ok(await renderPage(editorialCommunityId));
    } catch (error) {
      return Result.err({
        type: 'not-found',
        content: `Editorial community id '${editorialCommunityId.value}' not found`,
      });
    }
  };
};
