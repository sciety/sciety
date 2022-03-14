import { JsonRecord } from 'fp-ts/Json';
import * as t from 'io-ts';
import { domainEventCodec } from '../types/codecs/DomainEvent';

export const domainEventsCodec = t.readonlyArray(domainEventCodec);

export type EventRow = {
  id: string,
  type: string,
  date: string,
  payload: JsonRecord,
};

export const selectAllEvents = 'SELECT id, type, date::text, payload FROM events';
