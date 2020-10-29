import { URL } from 'url';
import { Maybe, Result } from 'true-myth';
import createComposeFeedEvents from './compose-feed-events';
import ensureBiorxivDoi from './ensure-biorxiv-doi';
import createGetFeedEventsContent, { GetEditorialCommunity, GetReview } from './get-feed-events-content';
import createHandleArticleVersionErrors from './handle-article-version-errors';
import createProjectVotes, { GetEvents } from './project-votes';
import createRenderArticleAbstract, { GetArticleAbstract, RenderArticleAbstract } from './render-article-abstract';
import createRenderArticleVersionFeedItem from './render-article-version-feed-item';
import createRenderFeed from './render-feed';
import createRenderFlavourAFeed from './render-flavour-a-feed';
import createRenderPage, { RenderPageError } from './render-page';
import createRenderPageHeader, { RenderPageHeader } from './render-page-header';
import createRenderReviewFeedItem from './render-review-feed-item';
import createRenderVotes from './render-votes';
import { Logger } from '../infrastructure/logger';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import { FetchExternalArticle } from '../types/fetch-external-article';
import { ReviewId } from '../types/review-id';
import { User } from '../types/user';
import toUserId from '../types/user-id';

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

interface Ports {
  fetchArticle: FetchExternalArticle;
  fetchReview: GetReview;
  getEditorialCommunity: (editorialCommunityId: EditorialCommunityId) => Promise<Maybe<{
    name: string;
    avatar: URL;
  }>>,
  findReviewsForArticleDoi: FindReviewsForArticleDoi;
  findVersionsForArticleDoi: FindVersionsForArticleDoi;
  logger: Logger;
  getAllEvents: GetEvents;
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

export interface Params {
  doi?: string;
  flavour?: string;
  user: Maybe<User>;
}

type RenderPage = (params: Params) => Promise<Result<string, RenderPageError>>;

export default (ports: Ports): RenderPage => {
  const renderPageHeader = buildRenderPageHeader(ports);
  const renderAbstract = buildRenderAbstract(ports.fetchArticle);
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
  const getVotes = createProjectVotes(ports.getAllEvents);
  const renderFeed = createRenderFeed(
    getFeedEventsContent,
    createRenderReviewFeedItem(
      150,
      createRenderVotes(
        getVotes,
        async () => ({
          upVoted: true,
          downVoted: false,
        }),
      ),
    ),
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
    const userId = params.user.map((user) => user.id).unwrapOr(toUserId('fakeuser'));
    if (doi.value === '10.1101/646810' && params.flavour === 'a') {
      return renderFlavourA(doi, userId);
    }
    return renderPage(doi, userId);
  };
};
