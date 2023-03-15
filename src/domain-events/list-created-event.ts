import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { ListIdFromString } from '../types/list-id';
import { generate } from '../types/event-id';
import { ListId } from '../types/list-id';
import { ListOwnerId } from '../types/list-owner-id';
import * as LOID from '../types/list-owner-id';

export const listCreatedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('ListCreated'),
  date: tt.DateFromISOString,
  listId: ListIdFromString,
  name: t.string,
  description: t.string,
  ownerId: LOID.fromStringCodec,
});

export type ListCreatedEvent = t.TypeOf<typeof listCreatedEventCodec>;

export const isListCreatedEvent = (event: { type: string }):
  event is ListCreatedEvent => event.type === 'ListCreated';

export const listCreated = (
  listId: ListId,
  name: string,
  description: string,
  ownerId: ListOwnerId,
  date = new Date(),
): ListCreatedEvent => ({
  id: generate(),
  type: 'ListCreated',
  date,
  listId,
  name,
  description,
  ownerId,
});
