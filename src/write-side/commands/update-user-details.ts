import * as t from 'io-ts';
import { userIdCodec } from '../../types/user-id';

export const updateUserDetailsCommandCodec = t.type({
  id: userIdCodec,
  avatarUrl: t.union([t.string, t.undefined]),
  displayName: t.union([t.string, t.undefined]),
});

export type UpdateUserDetailsCommand = t.TypeOf<typeof updateUserDetailsCommandCodec>;
