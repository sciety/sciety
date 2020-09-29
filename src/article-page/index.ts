import { URL } from 'url';
import { Maybe, Result } from 'true-myth';
import ensureBiorxivDoi from './ensure-biorxiv-doi';
import createFetchPciRecommendation from './fetch-pci-recommendation';
import createGetHardcodedEndorsements from './get-hardcoded-endorsements';
import createGetHardcodedReviews, { GetEditorialCommunity } from './get-hardcoded-reviews';
import createRenderArticleAbstract, { GetArticleAbstract, RenderArticleAbstract } from './render-article-abstract';
import createRenderEndorsements from './render-endorsements';
import createRenderFeed from './render-feed';
import renderFlavourA from './render-flavour-a';
import createRenderPage, { RenderPageError } from './render-page';
import createRenderPageHeader, {
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
import { FetchExternalArticle } from '../types/fetch-external-article';

interface Ports {
  fetchArticle: FetchExternalArticle;
  fetchReview: GetReview;
  getEditorialCommunity: (editorialCommunityId: EditorialCommunityId) => Promise<Maybe<{
    name: string;
    avatarUrl: string;
  }>>,
  findReviewsForArticleVersionDoi: GetReviews;
  logger: Logger;
}

const reviewsId = 'reviews';

const buildRenderPageHeader = (ports: Ports): RenderPageHeader => createRenderPageHeader(
  ports.fetchArticle,
);

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
  const getEditorialCommunity: GetEditorialCommunity = async (editorialCommunityId) => {
    const editorialCommunity = (await ports.getEditorialCommunity(editorialCommunityId)).unsafelyUnwrap();

    return {
      ...editorialCommunity,
      avatar: new URL(editorialCommunity.avatarUrl),
    };
  };
  const getReviews = createGetHardcodedReviews(ports.fetchReview, getEditorialCommunity);
  const renderFeed = createRenderFeed(getReviews, 150);
  const renderPage = createRenderPage(
    renderPageHeader,
    renderEndorsements,
    renderReviews,
    renderAbstract,
    renderFeed,
  );
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
    if (doi.value === '10.1101/646810' && params.flavour === 'a') {
      return Result.ok(renderFlavourA());
    }
    return renderPage(doi);
  };
};
