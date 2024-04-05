import { UserId } from '../../../../types/user-id';

export type Follower = {
  userId: UserId,
  listCount: number,
  followedGroupCount: number,
};
