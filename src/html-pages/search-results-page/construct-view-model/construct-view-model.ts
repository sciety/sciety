import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../../../types/data-error';
import {
  fetchExtraDetails,
  Ports as FetchExtraDetailsPorts,
} from './fetch-extra-details';
import { Params, performAllSearches, Ports as PerformAllSearchesPorts } from './perform-all-searches';
import { selectSubsetToDisplay } from './select-subset-to-display';
import { Ports as GetArticleVersionDatePorts, getLatestArticleVersionDate } from '../../../shared-components/article-card';
import { ViewModel } from '../view-model';

// ts-unused-exports:disable-next-line
export type Ports = PerformAllSearchesPorts
// The next two lines are necessary as getLatestVersionDate is not in CollectedPorts and is constructed locally
& Omit<FetchExtraDetailsPorts, 'getLatestArticleVersionDate'>
& GetArticleVersionDatePorts;

export const constructViewModel = (
  ports: Ports,
  pageSize: number,
) => (params: Params): TE.TaskEither<DE.DataError, ViewModel> => pipe(
  params,
  performAllSearches(ports)(pageSize),
  TE.map(selectSubsetToDisplay),
  TE.chainTaskK(fetchExtraDetails({
    ...ports,
    getLatestArticleVersionDate: getLatestArticleVersionDate(ports),
  })),
);
