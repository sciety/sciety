import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { GroupIdFromString } from '../../types/codecs/GroupIdFromString';
import { descriptionPathCodec } from '../../types/description-path';

export const addGroupCommandCodec = t.intersection([
  t.strict({
    groupId: GroupIdFromString,
    name: t.string,
    shortDescription: t.string,
    homepage: t.string,
    avatarPath: t.string,
    descriptionPath: descriptionPathCodec,
    slug: t.string,
  }),
  t.partial({
    issuedAt: tt.DateFromISOString,
  }),
]);

export type AddGroupCommand = t.TypeOf<typeof addGroupCommandCodec>;
