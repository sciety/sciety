import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { descriptionPathCodec } from '../types/description-path';
import { GroupIdFromStringCodec } from '../types/group-id';

export const groupDetailsUpdatedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('GroupDetailsUpdated'),
  date: tt.DateFromISOString,
  groupId: GroupIdFromStringCodec,
  name: t.union([t.string, t.undefined]),
  avatarPath: t.union([t.string, t.undefined]),
  descriptionPath: t.union([descriptionPathCodec, t.undefined]),
  largeLogoPath: t.union([t.string, t.undefined]),
  shortDescription: t.union([t.string, t.undefined]),
  homepage: t.union([t.string, t.undefined]),
  slug: t.union([t.string, t.undefined]),
});
