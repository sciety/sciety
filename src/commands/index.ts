import * as t from 'io-ts';
import { descriptionPathCodec } from './description-path-codec';
import * as LOID from '../types/list-owner-id';

export type CreateListCommand = {
  ownerId: LOID.ListOwnerId,
  name: string,
  description: string,
};

export const addGroupCommandCodec = t.type({
  name: t.string,
  shortDescription: t.string,
  homepage: t.string,
  avatarPath: t.string,
  descriptionPath: descriptionPathCodec,
  slug: t.string,
});

export type AddGroupCommand = {
  name: string,
  shortDescription: string,
  homepage: string,
  avatarPath: string,
  descriptionPath: string,
  slug: string,
};
