import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../../../types/data-error';
import { fetchExtraDetails } from './fetch-extra-details';
import { Params, performAllSearches } from './perform-all-searches';
import { selectSubsetToDisplay } from './select-subset-to-display';
import { ViewModel } from '../view-model';
import { Dependencies } from './dependencies';

export const constructViewModel = (
  dependencies: Dependencies,
  pageSize: number,
) => (params: Params): TE.TaskEither<DE.DataError, ViewModel> => pipe(
  params,
  performAllSearches(dependencies)(pageSize),
  TE.map(selectSubsetToDisplay),
  TE.chainTaskK(fetchExtraDetails(dependencies)),
);
