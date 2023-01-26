import { UserHandle } from './user-handle';
import { UserId } from './user-id';

export type UserDetails = {
  avatarUrl: string,
  displayName: string,
  handle: UserHandle,
  id: UserId,
};
