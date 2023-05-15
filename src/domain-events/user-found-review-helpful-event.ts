import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { userIdCodec } from '../types/user-id';
import { evaluationLocatorCodec } from '../types/evaluation-locator';

export const userFoundReviewHelpfulEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('UserFoundReviewHelpful'),
  date: tt.DateFromISOString,
  userId: userIdCodec,
  reviewId: evaluationLocatorCodec,
});
