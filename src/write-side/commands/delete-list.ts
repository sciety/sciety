import * as t from 'io-ts';
import { listIdCodec } from '../../types/list-id';

export const deleteListCommandCodec = t.strict({
  listId: listIdCodec,
});

export type DeleteListCommand = t.TypeOf<typeof deleteListCommandCodec>;
