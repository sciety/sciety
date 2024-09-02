import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { evaluationLocatorCodec } from '../types/evaluation-locator';

export const coarNotificationDeliveredEventCodec = t.strict({
  id: EventIdFromString,
  type: t.literal('CoarNotificationDelivered'),
  date: tt.DateFromISOString,
  evaluationLocator: evaluationLocatorCodec,
  targetId: t.string,
});
