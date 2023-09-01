import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../../../types/data-error';
import { fetchExtraDetails } from './fetch-extra-details';
import { Params, performSearch } from './perform-search';
import { ViewModel } from '../view-model';
import { Dependencies } from './dependencies';

export const constructViewModel = (
  dependencies: Dependencies,
  pageSize: number,
) => (params: Params): TE.TaskEither<DE.DataError, ViewModel> => pipe(
  params,
  performSearch(dependencies)(pageSize),
  TE.map((articles) => ({
    evaluatedOnly: pipe(
      params.evaluatedOnly,
      O.isSome,
    ),
    itemsToDisplay: articles.items,
    query: params.query,
    nextCursor: articles.nextCursor,
    pageNumber: O.getOrElse(() => 1)(params.page),
    numberOfPages: Math.ceil(articles.total / pageSize),
  })),
  TE.chainTaskK(fetchExtraDetails(dependencies)),
);
