import { ListId } from './list-id';
import { ListOwnerId } from './list-owner-id';

export type List = {
  id: ListId,
  name: string,
  description: string,
  articleIds: ReadonlyArray<string>,
  updatedAt: Date,
  ownerId: ListOwnerId,
};
