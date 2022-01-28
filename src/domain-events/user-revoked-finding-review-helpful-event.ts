import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { UserIdFromString } from '../types/codecs/UserIdFromString';
import { generate } from '../types/event-id';
import { ReviewId, reviewIdCodec } from '../types/review-id';
import { UserId } from '../types/user-id';

export const userRevokedFindingReviewHelpfulEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('UserRevokedFindingReviewHelpful'),
  date: tt.DateFromISOString,
  userId: UserIdFromString,
  reviewId: reviewIdCodec,
});

export type UserRevokedFindingReviewHelpfulEvent = t.TypeOf<typeof userRevokedFindingReviewHelpfulEventCodec>;

export const isUserRevokedFindingReviewHelpfulEvent = (event: { type: string }):
  event is UserRevokedFindingReviewHelpfulEvent => event.type === 'UserRevokedFindingReviewHelpful';

export const userRevokedFindingReviewHelpful = (
  userId: UserId,
  reviewId: ReviewId,
): UserRevokedFindingReviewHelpfulEvent => ({
  id: generate(),
  type: 'UserRevokedFindingReviewHelpful',
  date: new Date(),
  userId,
  reviewId,
});
