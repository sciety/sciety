import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { descriptionPathCodec } from '../types/description-path';
import { GroupIdFromStringCodec } from '../types/group-id';

export const groupJoinedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('GroupJoined'),
  date: tt.DateFromISOString,
  groupId: GroupIdFromStringCodec,
  name: t.string,
  avatarPath: t.string,
  descriptionPath: descriptionPathCodec,
  shortDescription: t.string,
  homepage: t.string,
  slug: t.string,
  largeLogoPath: t.union([t.string, t.undefined]),
});
