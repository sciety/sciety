import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';

export const buildPaginationHref = (path: string, pageNumber: O.Option<number>): O.Option<string> => pipe(
  pageNumber,
  O.map((number) => `${path}?page=${number}`),
);
