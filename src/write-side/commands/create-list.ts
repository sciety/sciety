import * as t from 'io-ts';
import { listIdCodec } from '../../types/list-id';
import * as LOID from '../../types/list-owner-id';

export const createListCommandCodec = t.strict({
  listId: listIdCodec,
  ownerId: LOID.fromObjectOfStrings,
  name: t.string,
  description: t.string,
});

export type CreateListCommand = t.TypeOf<typeof createListCommandCodec>;
