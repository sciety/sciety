import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { listIdCodec } from '../types/list-id';

export const listNameEditedEventCodec = t.strict({
  id: EventIdFromString,
  type: t.literal('ListNameEdited'),
  date: tt.DateFromISOString,
  listId: listIdCodec,
  name: t.string,
});
