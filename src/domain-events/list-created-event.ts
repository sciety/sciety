import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString.js';
import { listIdCodec } from '../types/list-id.js';
import * as LOID from '../types/list-owner-id.js';

export const listCreatedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('ListCreated'),
  date: tt.DateFromISOString,
  listId: listIdCodec,
  name: t.string,
  description: t.string,
  ownerId: LOID.fromStringCodec,
});
