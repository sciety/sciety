import { URL } from 'url';
import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import * as B from 'fp-ts/lib/boolean';
import { constant, flow, pipe } from 'fp-ts/lib/function';
import { Maybe, Result } from 'true-myth';
import ensureBiorxivDoi from './ensure-biorxiv-doi';
import { getArticleFeedEvents } from './get-article-feed-events';
import { GetReview } from './get-feed-events-content';
import { projectHasUserSavedArticle } from './project-has-user-saved-article';
import createProjectReviewResponseCounts from './project-review-response-counts';
import createProjectUserReviewResponse from './project-user-review-response';
import createRenderArticleAbstract from './render-article-abstract';
import createRenderArticleVersionFeedItem from './render-article-version-feed-item';
import createRenderFeed from './render-feed';
import createRenderPage, { Page, RenderPage } from './render-page';
import createRenderPageHeader from './render-page-header';
import createRenderReviewFeedItem from './render-review-feed-item';
import createRenderReviewResponses from './render-review-responses';
import { renderSavedLink } from './render-saved-link';
import Doi from '../types/doi';
import { DomainEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
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

type ArticleDetails = {
  title: SanitisedHtmlFragment;
  abstract: SanitisedHtmlFragment, // TODO Use HtmlFragment as the HTML is stripped
  authors: Array<string>;
};

type GetArticleDetails = (doi: Doi) => T.Task<Result<ArticleDetails, 'not-found'|'unavailable'>>;

type GetEvents = T.Task<ReadonlyArray<DomainEvent>>;
interface Ports {
  fetchArticle: GetArticleDetails;
  fetchReview: GetReview;
  getEditorialCommunity: (editorialCommunityId: EditorialCommunityId) => T.Task<Maybe<{
    name: string;
    avatar: URL;
  }>>,
  findReviewsForArticleDoi: FindReviewsForArticleDoi;
  findVersionsForArticleDoi: FindVersionsForArticleDoi;
  getAllEvents: GetEvents;
}

export interface Params {
  doi?: string;
  flavour?: string;
  user: O.Option<User>;
}

const getUserId = (user: O.Option<User>): O.Option<UserId> => pipe(
  user,
  O.map((u) => u.id),
);

type ArticlePage = (params: Params) => ReturnType<RenderPage>;

export default (ports: Ports): ArticlePage => {
  const shimmedFetchArticle = flow(
    ports.fetchArticle,
    T.map((result) => result.mapOrElse(
      (error) => E.left<'not-found'|'unavailable', ArticleDetails>(error),
      (success) => E.right<'not-found'|'unavailable', ArticleDetails >(success),
    )),
  );
  type RenderSavedLinkIfNeeded = (doi: Doi, userId: O.Option<UserId>) => T.Task<HtmlFragment>;
  type ViewModel = { state: 'logged-out' } | { state: 'saved', userId: UserId } | { state: 'not-saved' };
  const renderSavedLinkIfNeeded: RenderSavedLinkIfNeeded = (doi, userId) => pipe(
    userId,
    O.fold(
      (): T.Task<ViewModel> => T.of({ state: 'logged-out' }),
      (u) => pipe(
        ports.getAllEvents,
        T.map(flow(
          projectHasUserSavedArticle(doi, u),
          B.fold(
            (): ViewModel => ({ state: 'not-saved' }),
            (): ViewModel => ({ state: 'saved', userId: u }),
          ),
        )),
      ),
    ),
    T.map((viewModel: ViewModel) => {
      switch (viewModel.state) {
        case 'logged-out': return toHtmlFragment('');
        case 'not-saved': return toHtmlFragment('');
        case 'saved': return renderSavedLink(viewModel.userId);
      }
    }),
  );

  const renderPageHeader = createRenderPageHeader(shimmedFetchArticle, renderSavedLinkIfNeeded);
  const renderAbstract = createRenderArticleAbstract(
    flow(ports.fetchArticle, T.map((result) => result.map((article) => article.abstract))),
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
    createRenderArticleVersionFeedItem(),
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
      () => T.of(Result.err<Page, RenderPageError>({
        type: 'not-found',
        message: toHtmlFragment(`${params.doi ?? 'Article'} not found`),
      })),
      (doi: Doi) => renderPage(doi, getUserId(params.user)),
    ),
  );
};
