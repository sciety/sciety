import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { constant, pipe } from 'fp-ts/function';
import {
  FetchReview,
  getFeedEventsContent,
  GetUserReviewResponse,
} from './get-feed-events-content';
import { handleArticleVersionErrors } from './handle-article-version-errors';
import { mergeFeeds } from './merge-feeds';
import { FeedItem } from './render-feed';
import { DomainEvent } from '../../domain-events';
import { ArticleServer } from '../../types/article-server';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { GroupId } from '../../types/group-id';
import { ReviewId } from '../../types/review-id';
import { UserId } from '../../types/user-id';

export type FindReviewsForArticleDoi = (articleVersionDoi: Doi) => TE.TaskEither<DE.DataError, ReadonlyArray<{
  reviewId: ReviewId,
  groupId: GroupId,
  recordedAt: Date,
}>>;

export type FindVersionsForArticleDoi = (
  doi: Doi,
  server: ArticleServer
) => TO.TaskOption<RNEA.ReadonlyNonEmptyArray<{
  source: URL,
  occurredAt: Date,
  version: number,
}>>;

type GetArticleFeedEventsByDateDescending = (
  dependencies: Dependencies
) => (
  doi: Doi,
  server: ArticleServer,
  userId: O.Option<UserId>,
) => TE.TaskEither<DE.DataError, RNEA.ReadonlyNonEmptyArray<FeedItem>>;

type Dependencies = {
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  fetchReview: FetchReview,
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  getUserReviewResponse: GetUserReviewResponse,
};

export const getArticleFeedEventsByDateDescending: GetArticleFeedEventsByDateDescending = (
  deps,
) => (
  doi, server, userId,
) => pipe(
  [
    pipe(
      deps.findReviewsForArticleDoi(doi),
      TE.map(RA.map((review) => ({ type: 'review', ...review, occurredAt: review.recordedAt } as const))),
    ),
    pipe(
      deps.findVersionsForArticleDoi(doi, server),
      TO.matchW(
        constant([]),
        RNEA.map((version) => ({ type: 'article-version', ...version } as const)),
      ),
      TE.rightTask,
    ),
  ] as const,
  mergeFeeds,
  TE.chainTaskK((feedEvents) => getFeedEventsContent(deps)(feedEvents, server, userId)),
  TE.map((feedEvents) => handleArticleVersionErrors(feedEvents, server)),
);
