import * as t from 'io-ts';
import { GroupIdFromString } from '../../types/codecs/GroupIdFromString';
import { listIdCodec } from '../../types/list-id';

export const promoteListCommandCodec = t.strict({
  forGroup: GroupIdFromString,
  listId: listIdCodec,
});

export type PromoteListCommand = t.TypeOf<typeof promoteListCommandCodec>;
