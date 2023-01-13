import * as LOID from '../../types/list-owner-id';

export type CreateListCommand = {
  ownerId: LOID.ListOwnerId,
  name: string,
  description: string,
};
