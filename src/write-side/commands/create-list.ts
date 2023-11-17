import * as t from 'io-ts';
import { listIdCodec } from '../../types/list-id.js';
import * as LOID from '../../types/list-owner-id.js';

const createListCommandCodec = t.strict({
  listId: listIdCodec,
  ownerId: LOID.fromObjectOfStrings,
  name: t.string,
  description: t.string,
});

export type CreateListCommand = t.TypeOf<typeof createListCommandCodec>;
