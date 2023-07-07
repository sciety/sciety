import * as t from 'io-ts';
import { userHandleCodec } from '../../types/user-handle';
import { userIdCodec } from '../../types/user-id';

export const createUserAccountCommandCodec = t.strict({
  userId: userIdCodec,
  handle: userHandleCodec,
  avatarUrl: t.string,
  displayName: t.string,
});

export type CreateUserAccountCommand = t.TypeOf<typeof createUserAccountCommandCodec>;
