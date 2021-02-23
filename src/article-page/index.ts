import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { ensureBiorxivDoi } from './ensure-biorxiv-doi';
import { FindVersionsForArticleDoi, getArticleFeedEvents } from './get-article-feed-events';
import { GetReview } from './get-feed-events-content';
import { projectHasUserSavedArticle } from './project-has-user-saved-article';
import { createProjectReviewResponseCounts } from './project-review-response-counts';
import { createProjectUserReviewResponse } from './project-user-review-response';
import { RenderActivityPage, renderActivityPage } from './render-activity-page';
import { createRenderArticleAbstract } from './render-article-abstract';
import { renderArticleVersionFeedItem } from './render-article-version-feed-item';
import { createRenderFeed } from './render-feed';
import { renderMetaPage } from './render-meta-page';
import { createRenderPage, RenderPage } from './render-page';
import { createRenderPageHeader } from './render-page-header';
import { createRenderReviewFeedItem } from './render-review-feed-item';
import { createRenderReviewResponses } from './render-review-responses';
import { renderSaveArticle } from './render-save-article';
import { renderTweetThis } from './render-tweet-this';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { DomainEvent } from '../types/domain-events';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { toHtmlFragment } from '../types/html-fragment';
import { ReviewId } from '../types/review-id';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type FindReviewsForArticleDoi = (articleVersionDoi: Doi) => T.Task<ReadonlyArray<{
  reviewId: ReviewId,
  editorialCommunityId: EditorialCommunityId,
  occurredAt: Date,
}>>;

type ArticleDetails = {
  title: SanitisedHtmlFragment,
  abstract: SanitisedHtmlFragment, // TODO Use HtmlFragment as the HTML is stripped
  authors: Array<string>,
  server: ArticleServer,
};

type GetArticleDetails = (doi: Doi) => TE.TaskEither<'not-found'|'unavailable', ArticleDetails>;

type GetEvents = T.Task<ReadonlyArray<DomainEvent>>;
type Ports = {
  fetchArticle: GetArticleDetails,
  fetchReview: GetReview,
  getEditorialCommunity: (editorialCommunityId: EditorialCommunityId) => T.Task<O.Option<{
    name: string,
    avatarPath: string,
  }>>,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getAllEvents: GetEvents,
};

export type Params = {
  doi?: string,
  flavour?: string,
  user: O.Option<User>,
};

const getUserId = (user: O.Option<User>): O.Option<UserId> => pipe(
  user,
  O.map((u) => u.id),
);

// TODO: Should these be unified?
type ArticlePage = (params: Params) => ReturnType<RenderPage>;
type ActivityPage = (params: Params) => ReturnType<RenderActivityPage>;

export const articlePage = (ports: Ports): ArticlePage => {
  const renderPageHeader = createRenderPageHeader(
    ports.fetchArticle,
    renderTweetThis,
    renderSaveArticle(projectHasUserSavedArticle(ports.getAllEvents)),
  );
  const renderAbstract = createRenderArticleAbstract(
    flow(
      ports.fetchArticle,
      TE.map((article) => article.abstract),
    ),
  );
  const countReviewResponses = createProjectReviewResponseCounts(ports.getAllEvents);
  const renderFeed = createRenderFeed(
    getArticleFeedEvents(
      ports.findReviewsForArticleDoi,
      ports.findVersionsForArticleDoi,
      ports.fetchReview,
      ports.getEditorialCommunity,
    ),
    createRenderReviewFeedItem(
      150,
      createRenderReviewResponses(
        countReviewResponses,
        createProjectUserReviewResponse(ports.getAllEvents),
      ),
    ),
    renderArticleVersionFeedItem,
  );
  const renderPage = createRenderPage(
    renderPageHeader,
    renderAbstract,
    renderFeed,
    ports.fetchArticle,
  );
  return (params) => pipe(
    params.doi ?? '',
    ensureBiorxivDoi,
    O.fold(
      () => TE.left({
        type: 'not-found',
        message: toHtmlFragment(`${params.doi ?? 'Article'} not found`),
      }),
      (doi: Doi) => renderPage(doi, getUserId(params.user)),
    ),
  );
};

export const articleActivityPage = (ports: Ports): ActivityPage => {
  const countReviewResponses = createProjectReviewResponseCounts(ports.getAllEvents);
  const renderFeed = createRenderFeed(
    getArticleFeedEvents(
      ports.findReviewsForArticleDoi,
      ports.findVersionsForArticleDoi,
      ports.fetchReview,
      ports.getEditorialCommunity,
    ),
    createRenderReviewFeedItem(
      150,
      createRenderReviewResponses(
        countReviewResponses,
        createProjectUserReviewResponse(ports.getAllEvents),
      ),
    ),
    renderArticleVersionFeedItem,
  );
  const renderPage = renderActivityPage(
    renderFeed,
    ports.fetchArticle,
    renderSaveArticle(projectHasUserSavedArticle(ports.getAllEvents)),
    renderTweetThis,
  );

  return (params) => pipe(
    params.doi ?? '',
    ensureBiorxivDoi,
    O.fold(
      () => TE.left({
        type: 'not-found',
        message: toHtmlFragment(`${params.doi ?? 'Article'} not found`),
      }),
      (doi: Doi) => renderPage(doi, getUserId(params.user)),
    ),
  );
};

export const articleMetaPage = (ports: Ports): ArticlePage => {
  const renderAbstract = createRenderArticleAbstract(
    flow(
      ports.fetchArticle,
      TE.map((article) => article.abstract),
    ),
  );
  const renderPage = renderMetaPage(
    renderAbstract,
    ports.fetchArticle,
  );
  return (params) => pipe(
    params.doi ?? '',
    ensureBiorxivDoi,
    O.fold(
      () => TE.left({
        type: 'not-found',
        message: toHtmlFragment(`${params.doi ?? 'Article'} not found`),
      }),
      (doi: Doi) => renderPage(doi, getUserId(params.user)),
    ),
  );
};
