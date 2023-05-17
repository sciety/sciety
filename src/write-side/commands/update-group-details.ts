import * as t from 'io-ts';
import { GroupIdFromString } from '../../types/codecs/GroupIdFromString';
import { descriptionPathCodec } from '../../types/description-path';

export const updateGroupDetailsCommandCodec = t.type({
  groupId: GroupIdFromString,
  name: t.union([t.string, t.undefined]),
  shortDescription: t.union([t.string, t.undefined]),
  homepage: t.union([t.string, t.undefined]),
  avatarPath: t.union([t.string, t.undefined]),
  descriptionPath: t.union([descriptionPathCodec, t.undefined]),
  slug: t.union([t.string, t.undefined]),
});

export type UpdateGroupDetailsCommand = t.TypeOf<typeof updateGroupDetailsCommandCodec>;
