import { ListId } from '../types/list-id';
import { ListOwnerId } from '../types/list-owner-id';

// ts-unused-exports:disable-next-line
export type List = {
  listId: ListId,
  ownerId: ListOwnerId,
  articleIds: Array<string>,
};

export type SelectAllListsOwnedBy = (listOwnerId: ListOwnerId) => ReadonlyArray<List>;
