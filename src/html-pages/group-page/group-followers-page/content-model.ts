import { Group } from '../../../types/group';
import { UserId } from '../../../types/user-id';

export type Follower = {
  userId: UserId,
  listCount: number,
  followedGroupCount: number,
};

export type ContentModel = {
  followers: ReadonlyArray<Follower>,
  group: Group,
  pageNumber: number,
};
