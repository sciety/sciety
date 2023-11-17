import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString.js';
import { listIdCodec } from '../types/list-id.js';

export const listDescriptionEditedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('ListDescriptionEdited'),
  date: tt.DateFromISOString,
  listId: listIdCodec,
  description: t.string,
});
