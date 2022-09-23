import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString';
import { descriptionPathCodec } from '../types/description-path';
import { generate } from '../types/event-id';
import { Group } from '../types/group';

export const groupJoinedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('GroupJoined'),
  date: tt.DateFromISOString,
  groupId: GroupIdFromString,
  name: t.string,
  avatarPath: t.string,
  descriptionPath: descriptionPathCodec,
  shortDescription: t.string,
  homepage: t.string,
  slug: t.string,
});

export type GroupJoinedEvent = t.TypeOf<typeof groupJoinedEventCodec>;

export const isGroupJoinedEvent = (event: { type: string }):
  event is GroupJoinedEvent => event.type === 'GroupJoined';

export const groupJoined = (group: Group, date: Date = new Date()): GroupJoinedEvent => ({
  id: generate(),
  type: 'GroupJoined',
  date,
  groupId: group.id,
  name: group.name,
  avatarPath: group.avatarPath,
  descriptionPath: group.descriptionPath,
  shortDescription: group.shortDescription,
  homepage: group.homepage,
  slug: group.slug,
});
