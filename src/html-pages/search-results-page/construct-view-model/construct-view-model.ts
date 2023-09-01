import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../../../types/data-error';
import { fetchExtraDetails } from './fetch-extra-details';
import { Params, performSearch } from './perform-search';
import { selectSubsetToDisplay } from './select-subset-to-display';
import { ViewModel } from '../view-model';
import { Dependencies } from './dependencies';

export const constructViewModel = (
  dependencies: Dependencies,
  pageSize: number,
) => (params: Params): TE.TaskEither<DE.DataError, ViewModel> => pipe(
  params,
  performSearch(dependencies)(pageSize),
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
  TE.map(selectSubsetToDisplay),
  TE.chainTaskK(fetchExtraDetails(dependencies)),
);
