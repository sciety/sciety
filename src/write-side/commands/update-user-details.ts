import * as t from 'io-ts';
import { userIdCodec } from '../../types/user-id.js';

export const updateUserDetailsCommandCodec = t.strict({
  userId: userIdCodec,
  avatarUrl: t.union([t.string, t.undefined]),
  displayName: t.union([t.string, t.undefined]),
});

export type UpdateUserDetailsCommand = t.TypeOf<typeof updateUserDetailsCommandCodec>;
