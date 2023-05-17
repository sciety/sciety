import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { listIdCodec, ListId } from '../types/list-id';
import { generate } from '../types/event-id';

export const listDescriptionEditedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('ListDescriptionEdited'),
  date: tt.DateFromISOString,
  listId: listIdCodec,
  description: t.string,
});

export type ListDescriptionEditedEvent = t.TypeOf<typeof listDescriptionEditedEventCodec>;

export const listDescriptionEdited = (
  listId: ListId,
  description: string,
  date: Date = new Date(),
): ListDescriptionEditedEvent => ({
  id: generate(),
  type: 'ListDescriptionEdited',
  date,
  listId,
  description,
});
