import { JsonRecord } from 'fp-ts/Json';
import * as t from 'io-ts';
import { articleAddedToListEventCodec, listCreatedEventCodec } from '../domain-events';

const listsEventCodec = t.union([
  articleAddedToListEventCodec,
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
  WHERE type = 'ListCreated' OR type = 'ArticleAddedToList'
`;

export const selectListsEventsWithNewerDate = `
  SELECT id, type, date::text, payload 
  FROM events 
  WHERE (type = 'ListCreated' OR type = 'ArticleAddedToList')
  AND date > $1
`;
