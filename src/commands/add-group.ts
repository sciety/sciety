import * as t from 'io-ts';
import { descriptionPathCodec } from '../types/description-path';

export const addGroupCommandCodec = t.type({
  name: t.string,
  shortDescription: t.string,
  homepage: t.string,
  avatarPath: t.string,
  descriptionPath: descriptionPathCodec,
  slug: t.string,
});

export type AddGroupCommand = t.TypeOf<typeof addGroupCommandCodec>;
