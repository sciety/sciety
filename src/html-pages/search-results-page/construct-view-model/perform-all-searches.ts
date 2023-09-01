import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe, tupled } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { Matches } from './select-subset-to-display';
import * as DE from '../../../types/data-error';
import { Dependencies } from './dependencies';

export const paramsCodec = t.type({
  query: t.string,
  cursor: tt.optionFromNullable(t.string),
  page: tt.optionFromNullable(tt.NumberFromString),
  evaluatedOnly: tt.optionFromNullable(t.unknown),
});

export type Params = t.TypeOf<typeof paramsCodec>;

type PerformAllSearches = (
  dependencies: Dependencies,
) => (pageSize: number) => (params: Params) => TE.TaskEither<DE.DataError, Matches>;

export const performAllSearches: PerformAllSearches = (dependencies) => (pageSize) => (params) => pipe(
  [
    params.query,
    params.cursor,
    pipe(
      params.evaluatedOnly,
      O.isSome,
    ),
  ],
  tupled(dependencies.searchForArticles(pageSize)),
  TE.map((articles) => ({
    query: params.query,
    evaluatedOnly: pipe(
      params.evaluatedOnly,
      O.isSome,
    ),
    pageSize,
    pageNumber: params.page,
    articles,
  })),
);
