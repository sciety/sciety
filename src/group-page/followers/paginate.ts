import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { Follower } from './augment-with-user-details';
import * as DE from '../../types/data-error';

export type PartialViewModel = {
  followerCount: number,
  followers: ReadonlyArray<Follower>,
  nextPage: O.Option<number>,
};

const numberOfPages = (followerCount: number, pageSize: number) => (
  followerCount === 0
    ? 1
    : Math.ceil(followerCount / pageSize)
);

export const paginate = (
  pageNumber: number,
  pageSize: number,
) => (
  followers: ReadonlyArray<Follower>,
): E.Either<DE.DataError, PartialViewModel> => pipe(
  followers,
  E.fromPredicate(
    (fs) => pageNumber <= numberOfPages(fs.length, pageSize),
    () => DE.notFound,
  ),
  E.map(() => ({
    followers: followers.slice(
      pageSize * (pageNumber - 1),
      pageSize * pageNumber,
    ),
    followerCount: followers.length,
    nextPage: followers.length - pageSize * pageNumber > 0
      ? O.some(pageNumber + 1)
      : O.none,
  })),
);
