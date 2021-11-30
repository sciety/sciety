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
import { findReviewsForArticleDoi } from '../../shared-read-models/evaluations';
import { ArticleServer } from '../../types/article-server';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { UserId } from '../../types/user-id';

export type FindVersionsForArticleDoi = (
  doi: Doi,
  server: ArticleServer
) => TO.TaskOption<RNEA.ReadonlyNonEmptyArray<{
  source: URL,
  occurredAt: Date,
  version: number,
}>>;

type GetArticleFeedEventsByDateDescending = (
  ports: Ports
) => (
  doi: Doi,
  server: ArticleServer,
  userId: O.Option<UserId>,
) => TE.TaskEither<DE.DataError, RNEA.ReadonlyNonEmptyArray<FeedItem>>;

type Ports = {
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  fetchReview: FetchReview,
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  getUserReviewResponse: GetUserReviewResponse,
};

export const getArticleFeedEventsByDateDescending: GetArticleFeedEventsByDateDescending = (
  ports,
) => (
  doi, server, userId,
) => pipe(
  [
    pipe(
      ports.getAllEvents,
      T.map(findReviewsForArticleDoi(doi)),
      T.map(RA.map((review) => ({ type: 'review', ...review, occurredAt: review.recordedAt } as const))),
      TE.rightTask,
    ),
    pipe(
      ports.findVersionsForArticleDoi(doi, server),
      TO.matchW(
        constant([]),
        RNEA.map((version) => ({ type: 'article-version', ...version } as const)),
      ),
      TE.rightTask,
    ),
  ] as const,
  mergeFeeds,
  TE.chainTaskK((feedEvents) => getFeedEventsContent(ports)(feedEvents, server, userId)),
  TE.map((feedEvents) => handleArticleVersionErrors(feedEvents, server)),
);
