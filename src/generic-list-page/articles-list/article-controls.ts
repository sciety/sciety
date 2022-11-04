import * as O from 'fp-ts/Option';
import { ListOwnerId } from '../../types/list-owner-id';
import { UserId } from '../../types/user-id';

export const articleControls = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  listOwnerId: ListOwnerId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loggedInUserId: O.Option<UserId>,
): boolean => false;
