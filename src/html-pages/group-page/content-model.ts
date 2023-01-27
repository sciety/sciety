import { Group } from '../../types/group';

export type TabIndex = 0 | 1 | 2;

export type ContentModel = {
  group: Group,
  pageNumber: number,
  activeTabIndex: TabIndex,
};
