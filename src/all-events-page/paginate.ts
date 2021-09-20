import * as O from 'fp-ts/Option';

type Paginate = <I>(pageSize: number, page: number) => (events: ReadonlyArray<I>) => {
  items: ReadonlyArray<I>,
  nextPage: O.Option<number>,
};

export const paginate: Paginate = (pageSize, page) => (events) => ({
  items: events.slice(
    (page - 1) * pageSize,
    page * pageSize,
  ),
  nextPage: O.none,
});
