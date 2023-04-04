import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { userIdCodec } from '../../types/user-id';

export const updateUserDetailsCommandCodec = t.type({
  id: userIdCodec,
  avatarUrl: tt.optionFromNullable(t.string),
  displayName: tt.optionFromNullable(t.string),
});

export type UpdateUserDetailsCommand = t.TypeOf<typeof updateUserDetailsCommandCodec>;
