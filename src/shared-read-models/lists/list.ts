import { GroupId } from '../../types/group-id';

export type List = {
  name: string,
  description: string,
  articleCount: number,
  lastUpdated: Date,
  ownerId: GroupId,
};
