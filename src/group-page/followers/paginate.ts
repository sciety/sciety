import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { Follower } from './augment-with-user-details';
import * as DE from '../../types/data-error';
import { GroupId } from '../../types/group-id';

export type PartialViewModel = {
  followerCount: number,
  followers: ReadonlyArray<Follower>,
};

const numberOfPages = (followerCount: number, pageSize: number) => (
  followerCount === 0
    ? 1
    : Math.ceil(followerCount / pageSize)
);

export const paginate = (
  groupId: GroupId,
  pageNumber: number,
  pageSize: number,
) => (
  partialViewModel: PartialViewModel,
): E.Either<DE.DataError, PartialViewModel & { nextPage: O.Option<number> }> => pipe(
  partialViewModel,
  E.fromPredicate(
    ({ followerCount }) => pageNumber <= numberOfPages(followerCount, pageSize),
    () => DE.notFound,
  ),
  E.map(() => ({
    followers: partialViewModel.followers.slice(
      pageSize * (pageNumber - 1),
      pageSize * pageNumber,
    ),
    followerCount: partialViewModel.followerCount,
    nextPage: partialViewModel.followerCount - pageSize * pageNumber > 0
      ? O.some(pageNumber + 1)
      : O.none,
  })),
);
