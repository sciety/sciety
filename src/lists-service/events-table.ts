import { JsonRecord } from 'fp-ts/Json';
import * as t from 'io-ts';
import { evaluationRecordedEventCodec, listCreatedEventCodec } from '../domain-events';

const listsEventCodec = t.union([
  evaluationRecordedEventCodec,
  listCreatedEventCodec,
], 'type');

export const listsEventsCodec = t.readonlyArray(listsEventCodec);

export type EventRow = {
  id: string,
  type: string,
  date: string,
  payload: JsonRecord,
};

export const selectAllListsEvents = `
  SELECT id, type, date::text, payload 
  FROM events 
  WHERE type = 'ListCreated' OR type = 'EvaluationRecorded'
`;

export const selectListsEventsWithNewerDate = `
  SELECT id, type, date::text, payload 
  FROM events 
  WHERE type = 'ListCreated' OR type = 'EvaluationRecorded'
  AND date > $1
`;
