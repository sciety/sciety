import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { EventId } from '../types/event-id';

export type EventBase<T> = {
  id: EventId,
  date: Date,
  type: T,
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const eventBaseCodec = (type: string) => ({
  id: EventIdFromString,
  type: t.literal(type),
  date: tt.DateFromISOString,
});
