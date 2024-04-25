import * as t from 'io-ts';
import { descriptionPathCodec } from '../../types/description-path';
import { GroupIdFromStringCodec } from '../../types/group-id';

export const updateGroupDetailsCommandCodec = t.intersection([
  t.strict({
    groupId: GroupIdFromStringCodec,
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
