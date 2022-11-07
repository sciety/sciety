import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ListOwnerId } from '../../types/list-owner-id';
import { UserId } from '../../types/user-id';

export const shouldHaveArticleControls = (
  listOwnerId: ListOwnerId,
  loggedInUserId: O.Option<UserId>,
): boolean => {
  if (listOwnerId.tag === 'group-id') {
    return false;
  }
  return pipe(
    loggedInUserId,
    O.fold(
      () => false,
      (userId) => listOwnerId.value === userId,
    ),
  );
};
