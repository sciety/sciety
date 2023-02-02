import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { userIdCodec, UserId } from '../types/user-id';
import { generate } from '../types/event-id';
import { ReviewId, reviewIdCodec } from '../types/review-id';

export const userFoundReviewHelpfulEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('UserFoundReviewHelpful'),
  date: tt.DateFromISOString,
  userId: userIdCodec,
  reviewId: reviewIdCodec,
});

export type UserFoundReviewHelpfulEvent = t.TypeOf<typeof userFoundReviewHelpfulEventCodec>;

export const isUserFoundReviewHelpfulEvent = (event: { type: string }):
  event is UserFoundReviewHelpfulEvent => event.type === 'UserFoundReviewHelpful';

export const userFoundReviewHelpful = (
  userId: UserId,
  reviewId: ReviewId,
): UserFoundReviewHelpfulEvent => ({
  id: generate(),
  type: 'UserFoundReviewHelpful',
  date: new Date(),
  userId,
  reviewId,
});
