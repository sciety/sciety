import { URL } from 'url';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
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
import createRenderPage, { GetArticleDetails as GetArticleDetailsForPage, Page, RenderPage } from './render-page';
import createRenderPageHeader, { GetArticleDetails as GetArticleDetailsForHeader } from './render-page-header';
import createRenderReviewFeedItem from './render-review-feed-item';
import createRenderReviewResponses from './render-review-responses';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import { toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';
import { ReviewId } from '../types/review-id';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type FindReviewsForArticleDoi = (articleVersionDoi: Doi) => T.Task<ReadonlyArray<{
  reviewId: ReviewId;
  editorialCommunityId: EditorialCommunityId;
  occurredAt: Date;
}>>;

type FindVersionsForArticleDoi = (doi: Doi) => Promise<ReadonlyArray<{
  source: URL;
  occurredAt: Date;
  version: number;
}>>;

type GetArticleDetailsForAbstract = (doi: Doi) => T.Task<Result<{ abstract: SanitisedHtmlFragment }, 'not-found'|'unavailable'>>;

interface Ports {
  fetchArticle: GetArticleDetailsForPage & GetArticleDetailsForHeader<'not-found'|'unavailable'> & GetArticleDetailsForAbstract;
  fetchReview: GetReview;
  getEditorialCommunity: (editorialCommunityId: EditorialCommunityId) => Promise<Maybe<{
    name: string;
    avatar: URL;
  }>>,
  findReviewsForArticleDoi: FindReviewsForArticleDoi;
  findVersionsForArticleDoi: FindVersionsForArticleDoi;
  getAllEvents: GetEventForUserReviewResponse & GetEventForReviewResponseCounts;
}

export interface Params {
  doi?: string;
  flavour?: string;
  user: Maybe<User>;
}

const getUserId = (user: Maybe<User>): O.Option<UserId> => pipe(
  user.mapOr(O.none, (v) => O.some(v)),
  O.map((u) => u.id),
);

type ArticlePage = (params: Params) => ReturnType<RenderPage>;

export default (ports: Ports): ArticlePage => {
  const renderPageHeader = createRenderPageHeader(ports.fetchArticle);
  const renderAbstract = createRenderArticleAbstract(async (doi) => (
    (await ports.fetchArticle(doi)()).map((article) => article.abstract)
  ));
  const getEditorialCommunity: GetEditorialCommunity = async (editorialCommunityId) => (
    (await ports.getEditorialCommunity(editorialCommunityId)).unsafelyUnwrap()
  );
  const getFeedEventsContent = createHandleArticleVersionErrors(
    createGetFeedEventsContent(
      createComposeFeedEvents(
        async (doi) => (await ports.findReviewsForArticleDoi(doi)()).map((review) => ({
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
  return async (params) => pipe(
    params.doi ?? '',
    ensureBiorxivDoi,
    O.fold(
      async () => Result.err<Page, RenderPageError>({
        type: 'not-found',
        message: toHtmlFragment(`${params.doi ?? 'Article'} not found`),
      }),
      async (doi: Doi) => renderPage(doi, getUserId(params.user)),
    ),
  );
};
