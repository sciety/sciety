import * as O from 'fp-ts/Option';
import * as RTE from 'fp-ts/ReaderTaskEither';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import striptags from 'striptags';
import {
  FindReviewsForArticleDoi,
  FindVersionsForArticleDoi,
  getArticleFeedEvents,
  GetGroup,
} from './get-article-feed-events';
import { GetReview } from './get-feed-events-content';
import { projectHasUserSavedArticle } from './project-has-user-saved-article';
import { projectReviewResponseCounts } from './project-review-response-counts';
import { projectUserReviewResponse } from './project-user-review-response';
import { renderActivityPage } from './render-activity-page';
import {
  biorxivArticleVersionErrorFeedItem,
  medrxivArticleVersionErrorFeedItem,
} from './render-article-version-error-feed-item';
import { renderArticleVersionFeedItem } from './render-article-version-feed-item';
import { renderFeed as createRenderFeed } from './render-feed';
import { renderReviewFeedItem } from './render-review-feed-item';
import { renderSaveArticle } from './render-save-article';
import { renderTweetThis } from './render-tweet-this';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { DomainEvent } from '../types/domain-events';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { User } from '../types/user';

type ActivityPage = (params: Params) => RTE.ReaderTaskEither<Ports, RenderPageError, Page>;

type Params = {
  doi: Doi,
  user: O.Option<User>,
};

type GetArticleDetails = (doi: Doi) => TE.TaskEither<'not-found' | 'unavailable', {
  title: SanitisedHtmlFragment,
  abstract: SanitisedHtmlFragment, // TODO Use HtmlFragment as the HTML is stripped
  authors: Array<string>,
  server: ArticleServer,
}>;

type Ports = {
  fetchArticle: GetArticleDetails,
  fetchReview: GetReview,
  getGroup: GetGroup,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

const toErrorPage = (error: 'not-found' | 'unavailable') => {
  switch (error) {
    case 'not-found':
      return {
        type: error,
        message: toHtmlFragment(`
          We’re having trouble finding this information.
          Ensure you have the correct URL, or try refreshing the page.
          You may need to come back later.
        `),
      };
    case 'unavailable':
      return {
        type: error,
        message: toHtmlFragment(`
          We’re having trouble finding this information.
          Ensure you have the correct URL, or try refreshing the page.
          You may need to come back later.
        `),
      };
  }
};

export const articleActivityPage: ActivityPage = (params) => (ports) => {
  const renderFeed = createRenderFeed(
    (...args) => getArticleFeedEvents(...args)({
      ...ports,
      countReviewResponses: (reviewId) => projectReviewResponseCounts(reviewId)(ports.getAllEvents),
      getUserReviewResponse: (reviewId, userId) => projectUserReviewResponse(reviewId, userId)(ports.getAllEvents),
    }),
    (feedItem) => {
      switch (feedItem.type) {
        case 'article-version':
          return renderArticleVersionFeedItem(feedItem);
        case 'article-version-error':
          return feedItem.server === 'medrxiv' ? medrxivArticleVersionErrorFeedItem : biorxivArticleVersionErrorFeedItem;
        case 'review':
          return renderReviewFeedItem(850)(feedItem);
      }
    },
  );

  return pipe(
    params,
    TE.right,
    TE.bind('userId', ({ user }) => pipe(user, O.map((u) => u.id), TE.right)),
    TE.bind('articleDetails', ({ doi }) => pipe(doi, ports.fetchArticle)),
    TE.bindW('feed', ({ articleDetails, doi, userId }) => pipe(
      articleDetails.server,
      (server) => renderFeed(doi, server, userId),
      TE.orElse(flow(constant(''), TE.right)),
      TE.map(toHtmlFragment),
    )),
    TE.bindW('saveArticle', ({ doi, userId }) => pipe(
      renderSaveArticle(doi, userId)((...args) => projectHasUserSavedArticle(...args)(ports.getAllEvents)),
      TE.rightTask,
    )),
    TE.bindW('tweetThis', ({ doi }) => pipe(
      doi,
      renderTweetThis,
      TE.right,
    )),
    TE.bimap(
      toErrorPage,
      (components) => ({
        content: renderActivityPage(components),
        title: striptags(components.articleDetails.title),
        openGraph: {
          title: striptags(components.articleDetails.title),
          description: striptags(components.articleDetails.abstract),
        },
      }),
    ),
  );
};
