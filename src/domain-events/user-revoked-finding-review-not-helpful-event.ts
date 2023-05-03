import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { userIdCodec, UserId } from '../types/user-id';
import { generate } from '../types/event-id';
import { EvaluationLocator, reviewIdCodec } from '../types/evaluation-locator';

export const userRevokedFindingReviewNotHelpfulEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('UserRevokedFindingReviewNotHelpful'),
  date: tt.DateFromISOString,
  userId: userIdCodec,
  reviewId: reviewIdCodec,
});

export type UserRevokedFindingReviewNotHelpfulEvent = t.TypeOf<typeof userRevokedFindingReviewNotHelpfulEventCodec>;

export const isUserRevokedFindingReviewNotHelpfulEvent = (event: { type: string }):
  event is UserRevokedFindingReviewNotHelpfulEvent => event.type === 'UserRevokedFindingReviewNotHelpful';

export const userRevokedFindingReviewNotHelpful = (
  userId: UserId,
  reviewId: EvaluationLocator,
): UserRevokedFindingReviewNotHelpfulEvent => ({
  id: generate(),
  type: 'UserRevokedFindingReviewNotHelpful',
  date: new Date(),
  userId,
  reviewId,
});
