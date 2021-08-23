import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { Follower } from './augment-with-user-details';
import { GroupId } from '../../types/group-id';

export type PartialViewModel = {
  followerCount: number,
  followers: ReadonlyArray<Follower>,
};

export const paginate = (
  groupId: GroupId,
  pageNumber: number,
  pageSize: number,
) => (
  partialViewModel: PartialViewModel,
): E.Either<never, PartialViewModel & { nextPage: O.Option<number> }> => E.right({
  followers: partialViewModel.followers.slice(
    pageSize * (pageNumber - 1),
    pageSize * pageNumber,
  ),
  followerCount: partialViewModel.followerCount,
  nextPage: O.some(pageNumber + 1),
});
