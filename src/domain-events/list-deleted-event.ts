import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { listIdCodec } from '../types/list-id';

export const listDeletedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('ListDeleted'),
  date: tt.DateFromISOString,
  listId: listIdCodec,
});
