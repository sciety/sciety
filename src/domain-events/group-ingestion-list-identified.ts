import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString';
import { ListIdFromString } from '../types/codecs/ListIdFromString';
import { generate } from '../types/event-id';
import { GroupId } from '../types/group-id';
import { ListId } from '../types/list-id';

export const groupIngestionListIdentifiedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('GroupIngestionListIdentified'),
  date: tt.DateFromISOString,
  listId: ListIdFromString,
  groupId: GroupIdFromString,
});

export type GroupIngestionListIdentifiedEvent = t.TypeOf<typeof groupIngestionListIdentifiedEventCodec>;

export const isGroupIngestionListIdentified = (event: { type: string }):
  event is GroupIngestionListIdentifiedEvent => event.type === 'GroupIngestionListIdentified';

export const groupIngestionListIdentified = (
  listId: ListId,
  groupId: GroupId,
): GroupIngestionListIdentifiedEvent => ({
  id: generate(),
  type: 'GroupIngestionListIdentified',
  date: new Date(),
  listId,
  groupId,
});
