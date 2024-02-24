import { UserHandle } from './user-handle.js';
import { UserId } from './user-id.js';

export type UserDetails = {
  avatarUrl: string,
  displayName: string,
  handle: UserHandle,
  id: UserId,
};
