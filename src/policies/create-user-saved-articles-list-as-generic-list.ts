import { CreateListCommand } from '../commands';
import * as LOID from '../types/list-owner-id';
import { UserId } from '../types/user-id';

export const constructCommand = (userDetails: { userId: UserId, handle: string }): CreateListCommand => ({
  ownerId: LOID.fromUserId(userDetails.userId),
  name: `@${userDetails.handle}'s saved articles`,
  description: `Articles that have been saved by @${userDetails.handle}`,
});
