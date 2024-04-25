import * as t from 'io-ts';
import { GroupIdFromStringCodec } from '../../types/group-id';
import { listIdCodec } from '../../types/list-id';

export const promoteListCommandCodec = t.strict({
  forGroup: GroupIdFromStringCodec,
  listId: listIdCodec,
});

export type PromoteListCommand = t.TypeOf<typeof promoteListCommandCodec>;
