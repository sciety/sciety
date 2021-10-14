import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Follower } from './augment-with-user-details';
import { PageOfItems, paginate as sharedPaginate } from '../../shared-components/paginate';
import * as DE from '../../types/data-error';

export const paginate = (
  pageNumber: number,
  pageSize: number,
) => (
  followers: ReadonlyArray<Follower>,
): E.Either<DE.DataError, PageOfItems<Follower>> => pipe(
  followers,
  RA.matchW(
    () => E.right({
      items: [] as ReadonlyArray<Follower>,
      nextPage: O.none,
      pageNumber: 1,
      numberOfPages: 0,
      numberOfOriginalItems: 0,
    }),
    sharedPaginate(pageSize, pageNumber),
  ),
);
