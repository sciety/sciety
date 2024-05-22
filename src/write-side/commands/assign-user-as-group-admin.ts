import * as t from 'io-ts';
import { GroupIdFromStringCodec } from '../../types/group-id';
import { userIdCodec } from '../../types/user-id';

const assignUserAsGroupAdminCommandCodec = t.strict({
  groupId: GroupIdFromStringCodec,
  userId: userIdCodec,
});

// ts-unused-exports:disable-next-line
export type AssignUserAsGroupAdminCommand = t.TypeOf<typeof assignUserAsGroupAdminCommandCodec>;
