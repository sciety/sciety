import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as DE from '../types/data-error';

type Paginate = <I>(pageSize: number, page: number) => (items: ReadonlyArray<I>) => E.Either<DE.DataError, {
  items: ReadonlyArray<I>,
  nextPage: O.Option<number>,
}>;

export const paginate: Paginate = (pageSize, page) => (items) => pipe(
  items,
  RA.chunksOf(pageSize),
  RA.lookup(page - 1),
  E.fromOption(() => DE.notFound),
  E.map((pageOfItems) => ({
    items: pageOfItems,
    nextPage: pipe(
      page + 1,
      O.some,
      O.filter((nextPage) => nextPage <= Math.ceil(items.length / pageSize)),
    ),
  })),
);
