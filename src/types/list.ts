import { ListId } from './list-id';
import { ListOwnerId } from './list-owner-id';

export type List = {
  listId: ListId,
  ownerId: ListOwnerId,
  articleIds: Array<string>,
  lastUpdated: Date,
  name: string,
  description: string,
};
