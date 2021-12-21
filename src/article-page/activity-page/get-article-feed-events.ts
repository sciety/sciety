import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
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
import { getEvaluationsForDoi } from '../../shared-read-models/evaluations';
import { ArticleServer } from '../../types/article-server';
import { Doi } from '../../types/doi';
import { UserId } from '../../types/user-id';

export type FindVersionsForArticleDoi = (
  doi: Doi,
  server: ArticleServer
) => TO.TaskOption<RNEA.ReadonlyNonEmptyArray<{
  source: URL,
  publishedAt: Date,
  version: number,
}>>;

type GetArticleFeedEventsByDateDescending = (
  ports: Ports
) => (
  doi: Doi,
  server: ArticleServer,
  userId: O.Option<UserId>,
) => T.Task<RNEA.ReadonlyNonEmptyArray<FeedItem>>;

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
      T.map(getEvaluationsForDoi(doi)),
      T.map(RA.map((review) => ({ type: 'review', ...review } as const))),
    ),
    pipe(
      ports.findVersionsForArticleDoi(doi, server),
      TO.matchW(
        constant([]),
        RNEA.map((version) => ({ type: 'article-version', ...version } as const)),
      ),
    ),
  ] as const,
  mergeFeeds,
  T.chain(getFeedEventsContent(ports, server, userId)),
  T.map(handleArticleVersionErrors(server)),
);
