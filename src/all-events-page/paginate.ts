import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as DE from '../types/data-error';

type Paginate = <I>(pageSize: number, page: number) => (items: ReadonlyArray<I>) => E.Either<DE.DataError, {
  items: ReadonlyArray<I>,
  nextPage: O.Option<number>,
}>;

export const paginate: Paginate = (pageSize, page) => (items) => E.right({
  items: items.slice(
    (page - 1) * pageSize,
    page * pageSize,
  ),
  nextPage: pipe(
    page + 1,
    O.some,
    O.filter((nextPage) => nextPage <= Math.ceil(items.length / pageSize)),
  ),
});
