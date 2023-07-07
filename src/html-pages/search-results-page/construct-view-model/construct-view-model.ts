import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../../../types/data-error';
import {
  fetchExtraDetails,
  Ports as FetchExtraDetailsPorts,
} from './fetch-extra-details';
import { Params, performAllSearches, Ports as PerformAllSearchesPorts } from './perform-all-searches';
import { selectSubsetToDisplay } from './select-subset-to-display';
import { ViewModel } from '../view-model';

export type Ports = PerformAllSearchesPorts
// The next two lines are necessary as getLatestVersionDate is not in CollectedPorts and is constructed locally
& Omit<FetchExtraDetailsPorts, 'getLatestArticleVersionDate'>;

export const constructViewModel = (
  dependencies: Ports,
  pageSize: number,
) => (params: Params): TE.TaskEither<DE.DataError, ViewModel> => pipe(
  params,
  performAllSearches(dependencies)(pageSize),
  TE.map(selectSubsetToDisplay),
  TE.chainTaskK(fetchExtraDetails(dependencies)),
);
