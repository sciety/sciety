import { UserHandle } from '../../types/user-handle';
import { UserId } from '../../types/user-id';

export type CreateUserAccountCommand = {
  userId: UserId,
  handle: UserHandle,
  avatarUrl: string,
  displayName: string,
};
