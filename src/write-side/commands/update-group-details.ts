import * as t from 'io-ts';
import { GroupIdFromString } from '../../types/codecs/GroupIdFromString';
import { descriptionPathCodec } from '../../types/description-path';

export const updateGroupDetailsCommandCodec = t.intersection([
  t.strict({
    groupId: GroupIdFromString,
  }),
  t.partial({
    name: t.string,
    shortDescription: t.string,
    homepage: t.string,
    avatarPath: t.string,
    largeLogoPath: t.string,
    descriptionPath: descriptionPathCodec,
    slug: t.string,
  }),
]);

export type UpdateGroupDetailsCommand = t.TypeOf<typeof updateGroupDetailsCommandCodec>;
