import * as t from 'io-ts';
import { inputFieldNames } from '../../standards';
import { GroupIdFromStringCodec } from '../../types/group-id';
import { listIdCodec } from '../../types/list-id';

export const promoteListCommandCodec = t.strict({
  forGroup: GroupIdFromStringCodec,
  [inputFieldNames.listId]: listIdCodec,
}, 'promoteListCommandCodec');

export type PromoteListCommand = t.TypeOf<typeof promoteListCommandCodec>;
