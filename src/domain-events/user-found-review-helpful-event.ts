import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { userIdCodec, UserId } from '../types/user-id';
import { generate } from '../types/event-id';
import { EvaluationLocator, evaluationLocatorCodec } from '../types/evaluation-locator';

export const userFoundReviewHelpfulEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('UserFoundReviewHelpful'),
  date: tt.DateFromISOString,
  userId: userIdCodec,
  reviewId: evaluationLocatorCodec,
});

export type UserFoundReviewHelpfulEvent = t.TypeOf<typeof userFoundReviewHelpfulEventCodec>;

export const isUserFoundReviewHelpfulEvent = (event: { type: string }):
  event is UserFoundReviewHelpfulEvent => event.type === 'UserFoundReviewHelpful';

export const userFoundReviewHelpful = (
  userId: UserId,
  reviewId: EvaluationLocator,
): UserFoundReviewHelpfulEvent => ({
  id: generate(),
  type: 'UserFoundReviewHelpful',
  date: new Date(),
  userId,
  reviewId,
});
