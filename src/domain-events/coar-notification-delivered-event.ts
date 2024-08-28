import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';

export const coarNotificationDeliveredEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('CoarNotificationDelivered'),
  date: tt.DateFromISOString,
});
