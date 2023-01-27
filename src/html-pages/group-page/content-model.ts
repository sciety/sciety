import { Group } from '../../types/group';
import { Follower } from './followers/augment-with-user-details';

export type TabIndex = 0 | 1 | 2;

export type ContentModel = {
  group: Group,
  pageNumber: number,
  activeTabIndex: TabIndex,
  followers: ReadonlyArray<Follower>,
};
