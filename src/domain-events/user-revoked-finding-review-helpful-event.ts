import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { evaluationLocatorCodec } from '../types/evaluation-locator';
import { userIdCodec } from '../types/user-id';

export const userRevokedFindingReviewHelpfulEventCodec = t.strict({
  id: EventIdFromString,
  type: t.literal('UserRevokedFindingReviewHelpful'),
  date: tt.DateFromISOString,
  userId: userIdCodec,
  reviewId: evaluationLocatorCodec,
});
