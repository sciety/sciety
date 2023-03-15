import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { ListIdFromString } from '../types/list-id';
import { generate } from '../types/event-id';
import { ListId } from '../types/list-id';

export const listDescriptionEditedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('ListDescriptionEdited'),
  date: tt.DateFromISOString,
  listId: ListIdFromString,
  description: t.string,
});

export type ListDescriptionEditedEvent = t.TypeOf<typeof listDescriptionEditedEventCodec>;

export const isListDescriptionEditedEvent = (event: { type: string }):
  event is ListDescriptionEditedEvent => event.type === 'ListDescriptionEdited';

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
