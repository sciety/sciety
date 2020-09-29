import { URL } from 'url';
import { Maybe, Result } from 'true-myth';
import ensureBiorxivDoi from './ensure-biorxiv-doi';
import createFetchPciRecommendation from './fetch-pci-recommendation';
import createGetFeedReviews, { GetEditorialCommunity, GetFeedEvents } from './get-feed-reviews';
import createGetHardcodedEndorsements from './get-hardcoded-endorsements';
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
import createRenderReviewedEvent from './render-reviewed-event';
import createRenderReviews, { GetReviews, RenderReviews } from './render-reviews';
import { Logger } from '../infrastructure/logger';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import { FetchExternalArticle } from '../types/fetch-external-article';
import HypothesisAnnotationId from '../types/hypothesis-annotation-id';

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
  const getHardcodedFeedEvents: GetFeedEvents = async (doi) => {
    if (doi.value === '10.1101/646810') {
      return [
        {
          reviewId: new HypothesisAnnotationId('GFEW8JXMEeqJQcuc-6NFhQ'),
          editorialCommunityId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
          occurredAt: new Date('2020-05-14'),
        },
        {
          reviewId: new HypothesisAnnotationId('F4-xmpXMEeqf3_-2H0r-9Q'),
          editorialCommunityId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
          occurredAt: new Date('2020-05-14'),
        },
        {
          reviewId: new HypothesisAnnotationId('F7e5QpXMEeqnbCM3UE6XLQ'),
          editorialCommunityId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
          occurredAt: new Date('2020-05-14'),
        },
      ];
    }
    return [];
  };
  const getReviews = createGetFeedReviews(getHardcodedFeedEvents, ports.fetchReview, getEditorialCommunity);
  const renderFeed = createRenderFeed(getReviews, createRenderReviewedEvent(150));
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
