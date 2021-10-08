import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as DE from '../types/data-error';

type Paginate = <I>(pageSize: number, page: number) => (items: ReadonlyArray<I>) => E.Either<DE.DataError, {
  items: ReadonlyArray<I>,
  nextPage: O.Option<number>,
  pageNumber: number,
  numberOfPages: number,
  numberOfOriginalItems: number,
}>;

export const paginate: Paginate = (pageSize, page) => (items) => pipe(
  items,
  RA.chunksOf(pageSize),
  (chunks) => pipe(
    chunks,
    RA.lookup(page - 1),
    E.fromOption(() => DE.notFound),
    E.map((pageOfItems) => ({
      items: pageOfItems,
      pageNumber: page,
      numberOfPages: chunks.length,
      numberOfOriginalItems: items.length,
      nextPage: pipe(
        page + 1,
        O.some,
        O.filter((nextPage) => nextPage <= chunks.length),
      ),
    })),
  ),
);
