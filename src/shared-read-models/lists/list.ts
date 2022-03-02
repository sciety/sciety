import { GroupId } from '../../types/group-id';
import { ListId } from '../../types/list-id';

export type List = {
  id: ListId,
  name: string,
  description: string,
  articleCount: number,
  lastUpdated: Date,
  ownerId: GroupId,
};
