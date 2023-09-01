import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe, tupled } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as DE from '../../../types/data-error';
import { fetchExtraDetails } from './fetch-extra-details';
import { ViewModel } from '../view-model';
import { Dependencies } from './dependencies';

export const paramsCodec = t.type({
  query: t.string,
  cursor: tt.optionFromNullable(t.string),
  page: tt.optionFromNullable(tt.NumberFromString),
  evaluatedOnly: tt.withFallback(tt.BooleanFromString, false),
});

export type Params = t.TypeOf<typeof paramsCodec>;

export const constructViewModel = (
  dependencies: Dependencies,
  pageSize: number,
) => (params: Params): TE.TaskEither<DE.DataError, ViewModel> => pipe(
  [
    params.query,
    params.cursor,
    params.evaluatedOnly,
  ],
  tupled(dependencies.searchForArticles(pageSize)),
  TE.map((articles) => ({
    evaluatedOnly: params.evaluatedOnly,
    itemsToDisplay: articles.items,
    query: params.query,
    nextCursor: articles.nextCursor,
    pageNumber: O.getOrElse(() => 1)(params.page),
    numberOfPages: Math.ceil(articles.total / pageSize),
  })),
  TE.chainTaskK(fetchExtraDetails(dependencies)),
);
