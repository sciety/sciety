import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';

type Paginate = <I>(pageSize: number, page: number) => (items: ReadonlyArray<I>) => {
  items: ReadonlyArray<I>,
  nextPage: O.Option<number>,
};

export const paginate: Paginate = (pageSize, page) => (items) => ({
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
