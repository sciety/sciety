import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { GroupIdFromStringCodec } from '../types/group-id';
import { userIdCodec } from '../types/user-id';

export const userAssignedAsAdminOfGroupEventCodec = t.strict({
  id: EventIdFromString,
  type: t.literal('UserAssignedAsAdminOfGroup'),
  date: tt.DateFromISOString,
  userId: userIdCodec,
  groupId: GroupIdFromStringCodec,
});
