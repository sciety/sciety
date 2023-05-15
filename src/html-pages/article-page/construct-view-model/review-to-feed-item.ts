import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { sequenceS } from 'fp-ts/Apply';
import { UserId } from '../../../types/user-id';
import * as RI from '../../../types/evaluation-locator';
import { projectReviewResponseCounts } from './project-review-response-counts';
import { projectUserReviewResponse } from './project-user-review-response';
import { sanitise } from '../../../types/sanitised-html-fragment';
import { GroupId } from '../../../types/group-id';
import { EvaluationLocator } from '../../../types/evaluation-locator';
import { FetchReview, GetAllEvents } from '../../../shared-ports';
import { Queries } from '../../../shared-read-models';
import { ReviewFeedItem } from '../view-model';

export type Ports = {
  fetchReview: FetchReview,
  getAllEvents: GetAllEvents,
  getGroup: Queries['getGroup'],
};

export type ReviewEvent = {
  type: 'review',
  groupId: GroupId,
  reviewId: EvaluationLocator,
  publishedAt: Date,
};

export const reviewToFeedItem = (
  adapters: Ports,
  feedEvent: ReviewEvent,
  userId: O.Option<UserId>,
): T.Task<ReviewFeedItem> => pipe(
  {
    groupDetails: pipe(
      adapters.getGroup(feedEvent.groupId),
      O.match(
        () => ({
          groupName: 'A group',
          groupHref: `/groups/${feedEvent.groupId}`,
          groupAvatar: '/static/images/sciety-logo.jpg',
        }),
        (group) => ({
          groupName: group.name,
          groupHref: `/groups/${group.slug}`,
          groupAvatar: group.avatarPath,
        }),
      ),
      T.of,
    ),
    review: pipe(
      feedEvent.reviewId,
      adapters.fetchReview,
      TE.match(
        () => ({
          url: RI.inferredSourceUrl(feedEvent.reviewId),
          fullText: O.none,
        }),
        (review) => ({
          ...review,
          url: O.some(review.url),
          fullText: O.some(review.fullText),
        }),
      ),
    ),
    reviewResponses: pipe(
      adapters.getAllEvents,
      T.map(projectReviewResponseCounts(feedEvent.reviewId)),
    ),
    userReviewResponse: pipe(
      adapters.getAllEvents,
      T.map(projectUserReviewResponse(feedEvent.reviewId, userId)),
    ),
  },
  sequenceS(T.ApplyPar),
  T.map(({
    groupDetails, review, reviewResponses, userReviewResponse,
  }) => ({
    type: 'review' as const,
    id: feedEvent.reviewId,
    source: review.url,
    publishedAt: feedEvent.publishedAt,
    ...groupDetails,
    fullText: O.map(sanitise)(review.fullText),
    responses: pipe(
      userId,
      O.map(() => ({
        counts: reviewResponses,
        current: userReviewResponse,
      })),
    ),
  })),
);
