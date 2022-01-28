import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString';
import { generate } from '../types/event-id';
import { Group } from '../types/group';

const groupCreatedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('GroupCreated'),
  date: tt.DateFromISOString,
  groupId: GroupIdFromString,
  name: t.string,
  avatarPath: t.string,
  descriptionPath: t.string,
  shortDescription: t.string,
  homepage: t.string,
  slug: t.string,
  isAutomated: t.boolean,
});

export type GroupCreatedEvent = t.TypeOf<typeof groupCreatedEventCodec>;

export const isGroupCreatedEvent = (event: { type: string }):
  event is GroupCreatedEvent => event.type === 'GroupCreated';

export const groupCreated = (group: Group, date: Date = new Date()): GroupCreatedEvent => ({
  id: generate(),
  type: 'GroupCreated',
  date,
  groupId: group.id,
  name: group.name,
  avatarPath: group.avatarPath,
  descriptionPath: group.descriptionPath,
  shortDescription: group.shortDescription,
  homepage: group.homepage,
  slug: group.slug,
  isAutomated: group.isAutomated,
});
