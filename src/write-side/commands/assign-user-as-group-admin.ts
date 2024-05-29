import * as t from 'io-ts';
import { GroupIdFromStringCodec } from '../../types/group-id';
import { userIdCodec } from '../../types/user-id';

export const assignUserAsGroupAdminCommandCodec = t.strict({
  groupId: GroupIdFromStringCodec,
  userId: userIdCodec,
});

export type AssignUserAsGroupAdminCommand = t.TypeOf<typeof assignUserAsGroupAdminCommandCodec>;
