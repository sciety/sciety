import { URL } from 'url';
import { Maybe, Result } from 'true-myth';
import createComposeFeedEvents from './compose-feed-events';
import ensureBiorxivDoi from './ensure-biorxiv-doi';
import createGetFeedEventsContent, { GetEditorialCommunity, GetReview } from './get-feed-events-content';
import createGetHardcodedArticleVersionEvents, { GetJson } from './get-hardcoded-article-version-events';
import createRenderArticleAbstract, { GetArticleAbstract, RenderArticleAbstract } from './render-article-abstract';
import createRenderArticleVersionFeedItem from './render-article-version-feed-item';
import createRenderFeed from './render-feed';
import createRenderFlavourAFeed from './render-flavour-a-feed';
import createRenderPage, { RenderPageError } from './render-page';
import createRenderPageHeader, { RenderPageHeader } from './render-page-header';
import createRenderReviewFeedItem from './render-review-feed-item';
import { Logger } from '../infrastructure/logger';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import { FetchExternalArticle } from '../types/fetch-external-article';
import { ReviewId } from '../types/review-id';

type FindReviewsForArticleDoi = (articleVersionDoi: Doi) => Promise<ReadonlyArray<{
  reviewId: ReviewId;
  editorialCommunityId: EditorialCommunityId;
  occurredAt: Date;
}>>;

interface Ports {
  getJson: GetJson;
  fetchArticle: FetchExternalArticle;
  fetchReview: GetReview;
  getEditorialCommunity: (editorialCommunityId: EditorialCommunityId) => Promise<Maybe<{
    name: string;
    avatar: URL;
  }>>,
  findReviewsForArticleDoi: FindReviewsForArticleDoi;
  logger: Logger;
}

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

interface Params {
  doi?: string;
  flavour?: string;
}

type RenderPage = (params: Params) => Promise<Result<string, RenderPageError>>;

export default (ports: Ports): RenderPage => {
  const renderPageHeader = buildRenderPageHeader(ports);
  const renderAbstract = buildRenderAbstract(ports.fetchArticle);
  const getEditorialCommunity: GetEditorialCommunity = async (editorialCommunityId) => (
    (await ports.getEditorialCommunity(editorialCommunityId)).unsafelyUnwrap()
  );
  const getFeedEventsContent = createGetFeedEventsContent(
    createComposeFeedEvents(
      async (doi) => (await ports.findReviewsForArticleDoi(doi)).map((review) => ({
        type: 'review',
        ...review,
      })),
      createGetHardcodedArticleVersionEvents(ports.getJson, ports.fetchArticle),
    ),
    ports.fetchReview,
    getEditorialCommunity,
  );
  const renderFeed = createRenderFeed(
    getFeedEventsContent,
    createRenderReviewFeedItem(150),
    createRenderArticleVersionFeedItem(),
  );
  const renderFlavourAFeed = createRenderFlavourAFeed();
  const renderPage = createRenderPage(
    renderPageHeader,
    renderAbstract,
    renderFeed,
  );
  const renderFlavourA = createRenderPage(
    renderPageHeader,
    renderAbstract,
    renderFlavourAFeed,
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
      return renderFlavourA(doi);
    }
    return renderPage(doi);
  };
};
