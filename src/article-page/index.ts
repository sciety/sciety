import { Maybe, Result } from 'true-myth';
import ensureBiorxivDoi from './ensure-biorxiv-doi';
import createFetchPciRecommendation from './fetch-pci-recommendation';
import createGetHardcodedEndorsements from './get-hardcoded-endorsements';
import createRenderArticleAbstract, { GetArticleAbstract, RenderArticleAbstract } from './render-article-abstract';
import createRenderEndorsements from './render-endorsements';
import createRenderFlavouredPage from './render-flavoured-page';
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
import createRenderReviews, { GetReviews, RenderReviews } from './render-reviews';
import { Logger } from '../infrastructure/logger';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import EndorsementsRepository from '../types/endorsements-repository';
import { FetchExternalArticle } from '../types/fetch-external-article';

type GetEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => Promise<Maybe<{
  name: string;
}>>;

interface Ports {
  fetchArticle: FetchExternalArticle;
  getBiorxivCommentCount: GetCommentCount;
  fetchReview: GetReview;
  getEditorialCommunity: GetEditorialCommunity,
  endorsements: EndorsementsRepository,
  findReviewsForArticleVersionDoi: GetReviews;
  logger: Logger;
}

const reviewsId = 'reviews';

type GetEditorialCommunityName = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

const buildRenderPageHeader = (ports: Ports): RenderPageHeader => {
  const getArticleDetailsAdapter: GetArticleDetails = ports.fetchArticle;
  const reviewCountAdapter: GetReviewCount = async (articleDoi) => (
    (await ports.findReviewsForArticleVersionDoi(articleDoi)).length
  );
  const getEditorialCommunityName: GetEditorialCommunityName = async (editorialCommunityId) => (
    (await ports.getEditorialCommunity(editorialCommunityId)).unsafelyUnwrap().name
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
    (await ports.getEditorialCommunity(editorialCommunityId)).unsafelyUnwrap().name
  );

  const renderReview = createRenderReview(ports.fetchReview, getEditorialCommunityName, 1500);
  return createRenderReviews(
    renderReview,
    ports.findReviewsForArticleVersionDoi,
    reviewsId,
  );
};

interface Params {
  doi?: string;
  flavour?: string;
}

type RenderPage = (params: Params) => Promise<Result<string, RenderPageError>>;

export default (ports: Ports): RenderPage => {
  const renderPageHeader = buildRenderPageHeader(ports);
  const renderAbstract = buildRenderAbstract(ports.fetchArticle);
  const fetchPciRecommendation = createFetchPciRecommendation(ports.logger);
  const getEndorsements = createGetHardcodedEndorsements(fetchPciRecommendation);
  const renderEndorsements = createRenderEndorsements(getEndorsements);
  const renderReviews = buildRenderReviews(ports);
  const renderPage = createRenderPage(
    renderPageHeader,
    renderEndorsements,
    renderReviews,
    renderAbstract,
  );
  const renderFlavouredPage = createRenderFlavouredPage();
  return async (params) => {
    let doi: Doi;
    try {
      doi = ensureBiorxivDoi(params.doi ?? '').unsafelyUnwrap();
    } catch (error: unknown) {
      return Result.err({
        type: 'not-found',
        content: `${params.doi ?? 'Article'} not found`,
      });
    }
    if (doi.value === '10.1101/646810' && params.flavour !== undefined) {
      return Result.ok(renderFlavouredPage(params.flavour));
    }
    return renderPage(doi);
  };
};
