import { UserHandle } from './user-handle';
import { UserId } from './user-id';

export type UserDetails = {
  displayName: string,
  handle: UserHandle,
  id: UserId,
};
