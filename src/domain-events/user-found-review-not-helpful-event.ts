import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { UserIdFromString, UserId } from '../types/user-id';
import { generate } from '../types/event-id';
import { ReviewId, reviewIdCodec } from '../types/review-id';

export const userFoundReviewNotHelpfulEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('UserFoundReviewNotHelpful'),
  date: tt.DateFromISOString,
  userId: UserIdFromString,
  reviewId: reviewIdCodec,
});

export type UserFoundReviewNotHelpfulEvent = t.TypeOf<typeof userFoundReviewNotHelpfulEventCodec>;

export const isUserFoundReviewNotHelpfulEvent = (event: { type: string }):
  event is UserFoundReviewNotHelpfulEvent => event.type === 'UserFoundReviewNotHelpful';

export const userFoundReviewNotHelpful = (
  userId: UserId,
  reviewId: ReviewId,
): UserFoundReviewNotHelpfulEvent => ({
  id: generate(),
  type: 'UserFoundReviewNotHelpful',
  date: new Date(),
  userId,
  reviewId,
});
