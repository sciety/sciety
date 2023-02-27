import { Group } from '../../../types/group';
import { List } from '../../../types/list';
import { UserId } from '../../../types/user-id';

export type TabIndex = 0 | 1 | 2;

export type Follower = {
  userId: UserId,
  listCount: number,
  followedGroupCount: number,
};

export type ContentModel = {
  activeTabIndex: TabIndex,
  followers: ReadonlyArray<Follower>,
  group: Group,
  lists: ReadonlyArray<List>,
  pageNumber: number,
};
