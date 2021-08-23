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
): E.Either<never, PartialViewModel & { nextLink: O.Option<string> }> => E.right({
  followers: partialViewModel.followers.slice(0, pageSize),
  followerCount: partialViewModel.followerCount,
  nextLink: O.some(`/groups/${groupId}/followers?page=${pageNumber + 1}`),
});
