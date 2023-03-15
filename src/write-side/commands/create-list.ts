import * as t from 'io-ts';
import { ListIdFromString } from '../../types/list-id';
import * as LOID from '../../types/list-owner-id';

const createListCommandCodec = t.type({
  listId: ListIdFromString,
  ownerId: LOID.fromObjectOfStrings,
  name: t.string,
  description: t.string,
});

export type CreateListCommand = t.TypeOf<typeof createListCommandCodec>;
