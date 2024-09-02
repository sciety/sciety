import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { listIdCodec } from '../types/list-id';
import * as LOID from '../types/list-owner-id';

export const listCreatedEventCodec = t.strict({
  id: EventIdFromString,
  type: t.literal('ListCreated'),
  date: tt.DateFromISOString,
  listId: listIdCodec,
  name: t.string,
  description: t.string,
  ownerId: LOID.fromStringCodec,
});
