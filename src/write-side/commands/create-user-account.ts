import * as t from 'io-ts';
import { UserHandle, userHandleCodec } from '../../types/user-handle';
import { UserId, userIdCodec } from '../../types/user-id';

export const createUserAccountCommandCodec = t.type({
  userId: userIdCodec,
  handle: userHandleCodec,
  avatarUrl: t.string,
  displayName: t.string,
});

export type CreateUserAccountCommand = {
  userId: UserId,
  handle: UserHandle,
  avatarUrl: string,
  displayName: string,
};
