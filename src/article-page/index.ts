import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, identity, pipe } from 'fp-ts/function';
import { ensureBiorxivDoi } from './ensure-biorxiv-doi';
import { FindVersionsForArticleDoi, getArticleFeedEvents } from './get-article-feed-events';
import { projectHasUserSavedArticle } from './project-has-user-saved-article';
import { createProjectReviewResponseCounts } from './project-review-response-counts';
import { createProjectUserReviewResponse } from './project-user-review-response';
import { createRenderArticleAbstract } from './render-article-abstract';
import { renderArticleVersionFeedItem } from './render-article-version-feed-item';
import { createRenderFeed } from './render-feed';
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
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { HypothesisAnnotationId } from '../types/hypothesis-annotation-id';
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

type FetchReview = (id: ReviewId) => TE.TaskEither<'unavailable' | 'not-found', {
  fullText: HtmlFragment,
  url: URL,
}>;

type GetEvents = T.Task<ReadonlyArray<DomainEvent>>;
type Ports = {
  fetchArticle: GetArticleDetails,
  fetchReview: FetchReview,
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

type ArticlePage = (params: Params) => ReturnType<RenderPage>;

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
      (reviewId) => {
        let reviewUrl: URL;
        if (reviewId instanceof Doi) {
          reviewUrl = new URL(`https://doi.org/${reviewId.value}`);
        } else if (reviewId instanceof HypothesisAnnotationId) {
          reviewUrl = new URL(`https://hypothes.is/a/${reviewId.value}`);
        }
        return pipe(
          reviewId,
          ports.fetchReview,
          TE.bimap(
            () => ({
              url: reviewUrl,
              fullText: O.none,
            }),
            (review) => ({
              ...review,
              fullText: O.some(review.fullText),
            }),
          ),
          T.map(E.fold(identity, identity)),
        );
      },
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
