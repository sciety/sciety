import * as t from 'io-ts';
import { GroupIdFromStringCodec } from '../../types/group-id';

export const updateGroupDetailsCommandCodec = t.intersection([
  t.strict({
    groupId: GroupIdFromStringCodec,
  }),
  t.partial({
    name: t.string,
    shortDescription: t.string,
    avatarPath: t.string,
    largeLogoPath: t.string,
  }),
]);

export type UpdateGroupDetailsCommand = t.TypeOf<typeof updateGroupDetailsCommandCodec>;
