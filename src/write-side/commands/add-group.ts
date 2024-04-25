import * as t from 'io-ts';
import { descriptionPathCodec } from '../../types/description-path';
import { GroupIdFromStringCodec } from '../../types/group-id';

export const addGroupCommandCodec = t.strict({
  groupId: GroupIdFromStringCodec,
  name: t.string,
  shortDescription: t.string,
  homepage: t.string,
  avatarPath: t.string,
  descriptionPath: descriptionPathCodec,
  slug: t.string,
  largeLogoPath: t.string,
});

export type AddGroupCommand = t.TypeOf<typeof addGroupCommandCodec>;
