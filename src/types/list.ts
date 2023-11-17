import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { ListId, listIdCodec } from './list-id';
import * as LOID from './list-owner-id';
import { ListOwnerId } from './list-owner-id';

export const listCodec = t.type({
  id: listIdCodec,
  name: t.string,
  description: t.string,
  articleIds: t.array(t.string),
  updatedAt: tt.DateFromISOString,
  ownerId: LOID.fromStringCodec,
});

export type List = {
  id: ListId,
  name: string,
  description: string,
  articleIds: ReadonlyArray<string>,
  updatedAt: Date,
  ownerId: ListOwnerId,
};
