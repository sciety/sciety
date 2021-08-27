import { URL } from 'url';
import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { FeedItem } from './render-feed';
import { ArticleServer } from '../../types/article-server';
import { GroupId } from '../../types/group-id';
import { HtmlFragment } from '../../types/html-fragment';
import { ReviewId } from '../../types/review-id';
import * as RI from '../../types/review-id';
import { sanitise } from '../../types/sanitised-html-fragment';
import { UserId } from '../../types/user-id';

type ReviewEvent = {
  type: 'review',
  groupId: GroupId,
  reviewId: ReviewId,
  occurredAt: Date,
};

type ArticleVersionEvent = {
  type: 'article-version',
  source: URL,
  occurredAt: Date,
  version: number,
};

export type FeedEvent = ReviewEvent | ArticleVersionEvent;

export type FetchReview = (id: ReviewId) => TE.TaskEither<unknown, {
  fullText: HtmlFragment,
  url: URL,
}>;

export type CountReviewResponses = (reviewId: ReviewId) => T.Task<{ helpfulCount: number, notHelpfulCount: number }>;

export type GetUserReviewResponse = (reviewId: ReviewId, userId: O.Option<UserId>) => TO.TaskOption<'helpful' | 'not-helpful'>;

export type GetGroup = (id: GroupId) => T.Task<{
  name: string,
  avatarPath: string,
}>;

const articleVersionToFeedItem = (
  server: ArticleServer,
  feedEvent: ArticleVersionEvent,
) => (
  T.of({ ...feedEvent, server })
);

const reviewToFeedItem = (
  getReview: FetchReview,
  getGroup: GetGroup,
  countReviewResponses: CountReviewResponses,
  getUserReviewResponse: GetUserReviewResponse,
  feedEvent: ReviewEvent,
  userId: O.Option<UserId>,
) => pipe(
  {
    group: getGroup(feedEvent.groupId),
    review: pipe(
      feedEvent.reviewId,
      getReview,
      TE.match(
        () => ({
          url: RI.inferredUrl(feedEvent.reviewId),
          fullText: O.none,
        }),
        (review) => ({
          ...review,
          url: O.some(review.url),
          fullText: O.some(review.fullText),
        }),
      ),
    ),
    reviewResponses: pipe(feedEvent.reviewId, countReviewResponses),
    userReviewResponse: getUserReviewResponse(feedEvent.reviewId, userId),
  },
  sequenceS(T.ApplyPar),
  T.map(({
    group, review, reviewResponses, userReviewResponse,
  }) => ({
    type: 'review' as const,
    id: feedEvent.reviewId,
    source: review.url,
    occurredAt: feedEvent.occurredAt,
    groupId: feedEvent.groupId,
    groupName: group.name,
    groupAvatar: group.avatarPath,
    fullText: O.map(sanitise)(review.fullText),
    counts: reviewResponses,
    current: userReviewResponse,
  })),
);

type Dependencies = {
  fetchReview: FetchReview,
  getGroup: GetGroup,
  countReviewResponses: CountReviewResponses,
  getUserReviewResponse: GetUserReviewResponse,
};

type GetFeedEventsContent = <R extends Dependencies>(
  feedEvents: ReadonlyArray<FeedEvent>,
  server: ArticleServer,
  userId: O.Option<UserId>,
) => (r: R) => T.Task<ReadonlyArray<FeedItem>>;

export const getFeedEventsContent: GetFeedEventsContent = (feedEvents, server, userId) => ({
  fetchReview,
  getGroup,
  countReviewResponses,
  getUserReviewResponse,
}) => {
  const toFeedItem = (feedEvent: FeedEvent): T.Task<FeedItem> => {
    switch (feedEvent.type) {
      case 'article-version':
        return articleVersionToFeedItem(server, feedEvent);
      case 'review':
        return reviewToFeedItem(
          fetchReview, getGroup, countReviewResponses, getUserReviewResponse, feedEvent, userId,
        );
    }
  };
  return pipe(
    feedEvents,
    T.traverseArray(toFeedItem),
  );
};
