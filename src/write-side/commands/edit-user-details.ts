import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { userIdCodec } from '../../types/user-id';

export const editUserDetailsCommandCodec = t.type({
  id: userIdCodec,
  avatarUrl: tt.optionFromNullable(t.string),
  displayName: tt.optionFromNullable(t.string),
});

export type EditUserDetailsCommand = t.TypeOf<typeof editUserDetailsCommandCodec>;
