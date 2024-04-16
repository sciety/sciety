import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as LOID from '../../../types/list-owner-id';
import { UserId } from '../../../types/user-id';

export const userHasEditCapability = (loggedInUserId: O.Option<UserId>, listOwnerId: LOID.ListOwnerId): boolean => pipe(
  loggedInUserId,
  O.filter((userId) => LOID.eqListOwnerId.equals(LOID.fromUserId(userId), listOwnerId)),
  O.match(
    () => false,
    () => true,
  ),
);
