import { ListId } from '../../types/list-id';
import * as LOID from '../../types/list-owner-id';

export type CreateListCommand = {
  listId: ListId,
  ownerId: LOID.ListOwnerId,
  name: string,
  description: string,
};
