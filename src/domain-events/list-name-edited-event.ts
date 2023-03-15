import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { ListIdFromString } from '../types/list-id';
import { generate } from '../types/event-id';
import { ListId } from '../types/list-id';

export const listNameEditedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('ListNameEdited'),
  date: tt.DateFromISOString,
  listId: ListIdFromString,
  name: t.string,
});

export type ListNameEditedEvent = t.TypeOf<typeof listNameEditedEventCodec>;

export const isListNameEditedEvent = (event: { type: string }):
  event is ListNameEditedEvent => event.type === 'ListNameEdited';

export const listNameEdited = (
  listId: ListId,
  name: string,
  date: Date = new Date(),
): ListNameEditedEvent => ({
  id: generate(),
  type: 'ListNameEdited',
  date,
  listId,
  name,
});
