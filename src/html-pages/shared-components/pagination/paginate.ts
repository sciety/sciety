import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as DE from '../../../types/data-error';

export type PageOfItems<I> = {
  items: ReadonlyArray<I>,
  backwardPage: O.Option<number>,
  forwardPage: O.Option<number>,
  pageNumber: number,
  numberOfPages: number,
  numberOfOriginalItems: number,
};

const emptyFirstPage = <I>(): PageOfItems<I> => ({
  items: [],
  backwardPage: O.none,
  forwardPage: O.none,
  pageNumber: 1,
  numberOfPages: 1,
  numberOfOriginalItems: 0,
});

const selectAPageOfItems = (pageSize: number, page: number) => <I>(items: ReadonlyArray<I>) => pipe(
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
      backwardPage: page > 1 ? O.some(page - 1) : O.none,
      forwardPage: pipe(
        page + 1,
        O.some,
        O.filter((nextPage) => nextPage <= chunks.length),
      ),
    })),
  ),
);

type Paginate = <I>(
  pageSize: number,
  page: number,
) => (items: ReadonlyArray<I>) => E.Either<DE.DataError, PageOfItems<I>>;

/**
 * - When `items` are empty, returns an empty page 1.
 * - Returns on left when the `page` does not exist.
 */
export const paginate: Paginate = (pageSize, page) => (items) => pipe(
  items,
  RA.match(
    () => E.right(emptyFirstPage()),
    selectAPageOfItems(pageSize, page),
  ),
);
