import { reviewResponse } from '../../src/respond/review-response';
import { Doi } from '../../src/types/doi';
import {
  UserFoundReviewHelpfulEvent,
  UserFoundReviewNotHelpfulEvent,
  UserRevokedFindingReviewHelpfulEvent, UserRevokedFindingReviewNotHelpfulEvent,
} from '../../src/types/domain-events';
import { generate } from '../../src/types/event-id';
import { ReviewId } from '../../src/types/review-id';
import { toUserId, UserId } from '../../src/types/user-id';

type EventType =
    | UserFoundReviewHelpfulEvent
    | UserFoundReviewNotHelpfulEvent
    | UserRevokedFindingReviewHelpfulEvent
    | UserRevokedFindingReviewNotHelpfulEvent;

const makeEvent = (type: EventType['type'], userId: UserId, reviewId: ReviewId): EventType => ({
  id: generate(),
  date: new Date(),
  type,
  userId,
  reviewId,
});

describe('review-response', () => {
  const userId = toUserId('currentUser');
  const reviewId = new Doi('10.1101/currentReview');

  it.each([
    ['no events', [], 'none'],
    ['event for other review', [
      makeEvent('UserFoundReviewHelpful', userId, new Doi('10.1101/otherReview')),
    ], 'none'],
    ['helpful', [
      makeEvent('UserFoundReviewHelpful', userId, reviewId),
    ], 'helpful'],
    ['not-helpful', [
      makeEvent('UserFoundReviewNotHelpful', userId, reviewId),
    ], 'not-helpful'],
    ['helpful event from other user', [
      makeEvent('UserFoundReviewHelpful', toUserId('otherUser'), reviewId),
    ], 'none'],
    ['not-helpful event from other user', [
      makeEvent('UserFoundReviewNotHelpful', toUserId('otherUser'), reviewId),
    ], 'none'],
    ['helpful, revoked helpful', [
      makeEvent('UserFoundReviewHelpful', userId, reviewId),
      makeEvent('UserRevokedFindingReviewHelpful', userId, reviewId),
    ], 'none'],
    ['not-helpful, revoked not-helpful', [
      makeEvent('UserFoundReviewNotHelpful', userId, reviewId),
      makeEvent('UserRevokedFindingReviewNotHelpful', userId, reviewId),
    ], 'none'],
    ['helpful, revoked helpful, helpful', [
      makeEvent('UserFoundReviewHelpful', userId, reviewId),
      makeEvent('UserRevokedFindingReviewHelpful', userId, reviewId),
      makeEvent('UserFoundReviewHelpful', userId, reviewId),
    ], 'helpful'],
    ['helpful, revoked helpful, not-helpful', [
      makeEvent('UserFoundReviewHelpful', userId, reviewId),
      makeEvent('UserRevokedFindingReviewHelpful', userId, reviewId),
      makeEvent('UserFoundReviewNotHelpful', userId, reviewId),
    ], 'not-helpful'],
    ['not-helpful, revoked not-helpful, helpful', [
      makeEvent('UserFoundReviewNotHelpful', userId, reviewId),
      makeEvent('UserRevokedFindingReviewNotHelpful', userId, reviewId),
      makeEvent('UserFoundReviewHelpful', userId, reviewId),
    ], 'helpful'],
  ])('given %s', (_, events, expected) => {
    expect(reviewResponse(userId, reviewId)(events)).toStrictEqual(expected);
  });
});
