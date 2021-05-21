import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
import striptags from 'striptags';
import { FindReviewsForArticleDoi, FindVersionsForArticleDoi, getArticleFeedEvents } from './get-article-feed-events';
import { FetchReview } from './get-feed-events-content';
import { projectHasUserSavedArticle } from './project-has-user-saved-article';
import { projectReviewResponseCounts } from './project-review-response-counts';
import { projectUserReviewResponse } from './project-user-review-response';
import { renderActivityPage } from './render-activity-page';

import { biorxivArticleVersionErrorFeedItem, medrxivArticleVersionErrorFeedItem } from './render-article-version-error-feed-item';
import { renderArticleVersionFeedItem } from './render-article-version-feed-item';
import { renderFeed } from './render-feed';
import { renderReviewFeedItem } from './render-review-feed-item';
import { renderSaveArticle } from './render-save-article';
import { renderTweetThis } from './render-tweet-this';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { DomainEvent } from '../types/domain-events';
import { GroupId } from '../types/group-id';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { User } from '../types/user';

type ActivityPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

type Params = {
  doi: Doi,
  user: O.Option<User>,
};

type GetArticleDetails = (doi: Doi) => TE.TaskEither<'not-found' | 'unavailable', {
  title: SanitisedHtmlFragment,
  abstract: SanitisedHtmlFragment, // TODO Use HtmlFragment as the HTML is stripped
  authors: ReadonlyArray<string>,
  server: ArticleServer,
}>;

type GetGroup = (groupId: GroupId) => TO.TaskOption<{
  name: string,
  avatarPath: string,
}>;

type Ports = {
  fetchArticle: GetArticleDetails,
  fetchReview: FetchReview,
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

export const articleActivityPage = (ports: Ports): ActivityPage => (params) => pipe(
  {
    doi: TE.right(params.doi),
    userId: TE.right(pipe(params.user, O.map((u) => u.id))),
    articleDetails: ports.fetchArticle(params.doi),
    userArticleSaveState: pipe(
      params.user,
      O.map((u) => u.id),
      TO.fromOption,
      TO.chainTaskK((userId) => projectHasUserSavedArticle(params.doi, userId)(ports.getAllEvents)),
      TE.rightTask,
    ),
  },
  sequenceS(TE.ApplyPar),
  TE.bindW('feed', ({ articleDetails, doi, userId }) => pipe(
    articleDetails.server,
    (server) => getArticleFeedEvents(doi, server, userId)({
      ...ports,
      getGroup: flow(
        ports.getGroup,
        TO.getOrElse(() => {
          throw new Error('No such group');
        }),
      ),
      countReviewResponses: (reviewId) => projectReviewResponseCounts(reviewId)(ports.getAllEvents),
      getUserReviewResponse: (reviewId) => projectUserReviewResponse(reviewId, userId)(ports.getAllEvents),
    }),
    T.map(renderFeed(
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
    )),
    TE.rightTask,
  )),
  TE.map((deps) => ({
    articleDetails: deps.articleDetails,
    doi: deps.doi,
    feed: deps.feed,
    saveArticle: renderSaveArticle(deps.doi)(deps.userArticleSaveState),
    tweetThis: renderTweetThis(deps.doi),
  })),
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
