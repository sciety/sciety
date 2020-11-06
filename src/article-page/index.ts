import { URL } from 'url';
import { Maybe, Result } from 'true-myth';
import createComposeFeedEvents from './compose-feed-events';
import ensureBiorxivDoi from './ensure-biorxiv-doi';
import createGetFeedEventsContent, { GetEditorialCommunity, GetReview } from './get-feed-events-content';
import createHandleArticleVersionErrors from './handle-article-version-errors';
import createProjectReviewResponseCounts, { GetEvents as GetEventForReviewResponseCounts } from './project-review-response-counts';
import createProjectUserReviewResponse, { GetEvents as GetEventForUserReviewResponse } from './project-user-review-response';
import createRenderArticleAbstract from './render-article-abstract';
import createRenderArticleVersionFeedItem from './render-article-version-feed-item';
import createRenderFeed from './render-feed';
import createRenderPage, { GetArticleDetails as GetArticleDetailsForPage, RenderPage } from './render-page';
import createRenderPageHeader, { GetArticleDetails as GetArticleDetailsForHeader } from './render-page-header';
import createRenderReviewFeedItem from './render-review-feed-item';
import createRenderReviewResponses from './render-review-responses';
import { Logger } from '../infrastructure/logger';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import { ReviewId } from '../types/review-id';
import { User } from '../types/user';

type FindReviewsForArticleDoi = (articleVersionDoi: Doi) => Promise<ReadonlyArray<{
  reviewId: ReviewId;
  editorialCommunityId: EditorialCommunityId;
  occurredAt: Date;
}>>;

type FindVersionsForArticleDoi = (doi: Doi) => Promise<ReadonlyArray<{
  source: URL;
  occurredAt: Date;
  version: number;
}>>;

type GetArticleDetailsForAbstract = (doi: Doi) => Promise<Result<{ abstract: string }, 'not-found'|'unavailable'>>;

interface Ports {
  fetchArticle: GetArticleDetailsForPage & GetArticleDetailsForHeader<'not-found'|'unavailable'> & GetArticleDetailsForAbstract;
  fetchReview: GetReview;
  getEditorialCommunity: (editorialCommunityId: EditorialCommunityId) => Promise<Maybe<{
    name: string;
    avatar: URL;
  }>>,
  findReviewsForArticleDoi: FindReviewsForArticleDoi;
  findVersionsForArticleDoi: FindVersionsForArticleDoi;
  logger: Logger;
  getAllEvents: GetEventForUserReviewResponse & GetEventForReviewResponseCounts;
}

export interface Params {
  doi?: string;
  flavour?: string;
  user: Maybe<User>;
}

type ArticlePage = (params: Params) => ReturnType<RenderPage>;

export default (ports: Ports): ArticlePage => {
  const renderPageHeader = createRenderPageHeader(ports.fetchArticle);
  const renderAbstract = createRenderArticleAbstract(async (doi) => (
    (await ports.fetchArticle(doi)).map((article) => article.abstract)
  ));
  const getEditorialCommunity: GetEditorialCommunity = async (editorialCommunityId) => (
    (await ports.getEditorialCommunity(editorialCommunityId)).unsafelyUnwrap()
  );
  const getFeedEventsContent = createHandleArticleVersionErrors(
    createGetFeedEventsContent(
      createComposeFeedEvents(
        async (doi) => (await ports.findReviewsForArticleDoi(doi)).map((review) => ({
          type: 'review',
          ...review,
        })),
        async (doi) => (await ports.findVersionsForArticleDoi(doi)).map((version) => ({
          type: 'article-version',
          ...version,
        })),
      ),
      ports.fetchReview,
      getEditorialCommunity,
    ),
  );
  const countReviewResponses = createProjectReviewResponseCounts(ports.getAllEvents);
  const renderFeed = createRenderFeed(
    getFeedEventsContent,
    createRenderReviewFeedItem(
      150,
      createRenderReviewResponses(
        countReviewResponses,
        createProjectUserReviewResponse(ports.getAllEvents),
      ),
    ),
    createRenderArticleVersionFeedItem(),
  );
  const renderPage = createRenderPage(
    renderPageHeader,
    renderAbstract,
    renderFeed,
    ports.fetchArticle,
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
    const userId = params.user.map((user) => user.id);
    return renderPage(doi, userId);
  };
};
