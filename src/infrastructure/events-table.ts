import { JsonRecord } from 'fp-ts/Json';
import * as t from 'io-ts';
import { domainEventCodecIncludingDeprecated } from '../domain-events';

export const domainEventsCodecIncludingDeprecated = t.readonlyArray(domainEventCodecIncludingDeprecated);

export type EventRow = {
  id: string,
  type: string,
  date: string,
  payload: JsonRecord,
};

export const selectAllEvents = 'SELECT id, type, date::text, payload FROM events';
