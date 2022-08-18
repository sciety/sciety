import { ListId } from '../../types/list-id';
import { ListOwnerId } from '../../types/list-owner-id';

export type List = {
  id: ListId,
  name: string,
  description: string,
  articleCount: number,
  lastUpdated: Date,
  ownerId: ListOwnerId,
};
