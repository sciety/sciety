import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { userIdCodec, UserId } from '../types/user-id';
import { generate } from '../types/event-id';
import { EvaluationLocator, reviewIdCodec } from '../types/evaluation-locator';

export const userRevokedFindingReviewHelpfulEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('UserRevokedFindingReviewHelpful'),
  date: tt.DateFromISOString,
  userId: userIdCodec,
  reviewId: reviewIdCodec,
});

export type UserRevokedFindingReviewHelpfulEvent = t.TypeOf<typeof userRevokedFindingReviewHelpfulEventCodec>;

export const isUserRevokedFindingReviewHelpfulEvent = (event: { type: string }):
  event is UserRevokedFindingReviewHelpfulEvent => event.type === 'UserRevokedFindingReviewHelpful';

export const userRevokedFindingReviewHelpful = (
  userId: UserId,
  reviewId: EvaluationLocator,
): UserRevokedFindingReviewHelpfulEvent => ({
  id: generate(),
  type: 'UserRevokedFindingReviewHelpful',
  date: new Date(),
  userId,
  reviewId,
});
