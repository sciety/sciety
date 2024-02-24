import { JsonRecord } from 'fp-ts/Json';
import * as t from 'io-ts';
import { currentOrLegacyDomainEventCodec } from '../domain-events/index.js';

export const currentOrLegacyDomainEventsCodec = t.readonlyArray(currentOrLegacyDomainEventCodec);

export type EventRow = {
  id: string,
  type: string,
  date: string,
  payload: JsonRecord,
};

export const selectAllEvents = 'SELECT id, type, date::text, payload FROM events';
