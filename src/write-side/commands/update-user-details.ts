import * as t from 'io-ts';
import { userIdCodec } from '../../types/user-id';

export const updateUserDetailsCommandCodec = t.strict({
  userId: userIdCodec,
  displayName: t.union([t.string, t.undefined]),
});

export type UpdateUserDetailsCommand = t.TypeOf<typeof updateUserDetailsCommandCodec>;
