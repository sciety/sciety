import { Result } from 'true-myth';
import ensureBiorxivDoi from './ensure-biorxiv-doi';
import createRenderArticleAbstract, { GetArticleAbstract, RenderArticleAbstract } from './render-article-abstract';
import createRenderPage, { RenderPageError } from './render-page';
import createRenderPageHeader, {
  GetArticleDetails,
  GetCommentCount,
  GetEndorsingEditorialCommunityNames,
  GetReviewCount,
  RenderPageHeader,
} from './render-page-header';
import createRenderReview, {
  GetEditorialCommunityName as GetEditorialCommunityNameForRenderReview,
  GetReview,
} from './render-review';
import createRenderReviews, { RenderReviews } from './render-reviews';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import EndorsementsRepository from '../types/endorsements-repository';
import { FetchExternalArticle } from '../types/fetch-external-article';
import ReviewReferenceRepository from '../types/review-reference-repository';

interface Ports {
  fetchArticle: FetchExternalArticle;
  getBiorxivCommentCount: GetCommentCount;
  fetchReview: GetReview;
  editorialCommunities: EditorialCommunityRepository;
  endorsements: EndorsementsRepository,
  reviewReferenceRepository: ReviewReferenceRepository;
}

const reviewsId = 'reviews';

type GetEditorialCommunityName = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

const buildRenderPageHeader = (ports: Ports): RenderPageHeader => {
  const getArticleDetailsAdapter: GetArticleDetails = ports.fetchArticle;
  const reviewCountAdapter: GetReviewCount = async (articleDoi) => (
    (await ports.reviewReferenceRepository.findReviewsForArticleVersionDoi(articleDoi)).length
  );
  const getEditorialCommunityName: GetEditorialCommunityName = async (editorialCommunityId) => (
    (await ports.editorialCommunities.lookup(editorialCommunityId)).unsafelyUnwrap().name
  );
  const getEndorsingEditorialCommunityNames: GetEndorsingEditorialCommunityNames = async (doi) => (
    Promise.all((await ports.endorsements.endorsingEditorialCommunityIds(doi)).map(getEditorialCommunityName))
  );
  return createRenderPageHeader(
    getArticleDetailsAdapter,
    reviewCountAdapter,
    ports.getBiorxivCommentCount,
    getEndorsingEditorialCommunityNames,
    `#${reviewsId}`,
  );
};

const buildRenderAbstract = (fetchAbstract: FetchExternalArticle): RenderArticleAbstract => {
  const abstractAdapter: GetArticleAbstract = async (articleDoi) => {
    const fetchedArticle = await fetchAbstract(articleDoi);
    return fetchedArticle.map((article) => ({ content: article.abstract }));
  };
  return createRenderArticleAbstract(abstractAdapter);
};

const buildRenderReviews = (ports: Ports): RenderReviews => {
  const getEditorialCommunityName: GetEditorialCommunityNameForRenderReview = async (editorialCommunityId) => (
    (await ports.editorialCommunities.lookup(editorialCommunityId)).unsafelyUnwrap().name
  );

  const renderReview = createRenderReview(ports.fetchReview, getEditorialCommunityName, 1500);
  return createRenderReviews(
    renderReview,
    ports.reviewReferenceRepository.findReviewsForArticleVersionDoi,
    reviewsId,
  );
};

interface Params {
  doi?: string;
}

type RenderPage = (params: Params) => Promise<Result<string, RenderPageError>>;

export default (ports: Ports): RenderPage => {
  const renderPageHeader = buildRenderPageHeader(ports);
  const renderAbstract = buildRenderAbstract(ports.fetchArticle);
  const renderReviews = buildRenderReviews(ports);
  const renderPage = createRenderPage(
    renderPageHeader,
    renderReviews,
    renderAbstract,
  );
  return async (params) => {
    let doi: Doi;
    try {
      doi = ensureBiorxivDoi(params.doi ?? '').unsafelyUnwrap();
    } catch (error) {
      return Result.err({
        type: 'not-found',
        content: `${params.doi ?? 'Article'} not found`,
      });
    }
    return renderPage(doi);
  };
};
