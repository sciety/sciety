import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString';
import { DescriptionPath, descriptionPathCodec } from '../types/description-path';
import { generate } from '../types/event-id';
import { GroupId } from '../types/group-id';

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

export const groupJoined = (
  groupId: GroupId,
  name: string,
  avatarPath: string,
  descriptionPath: DescriptionPath,
  shortDescription: string,
  homepage: string,
  slug: string,
  date: Date = new Date(),
): GroupJoinedEvent => ({
  id: generate(),
  type: 'GroupJoined',
  date,
  groupId,
  name,
  avatarPath,
  descriptionPath,
  shortDescription,
  homepage,
  slug,
});
