import * as TE from 'fp-ts/TaskEither';
import { FetchData } from './fetch-data';
import { FetchHead } from './fetch-head';
import { DiscoveredPublishedEvaluations } from './types/discovered-published-evaluations';

export type DependenciesForFetchHead = {
  fetchHead: FetchHead,
};

export type Dependencies = DependenciesForFetchHead & {
  fetchData: FetchData,
};

export type DiscoverPublishedEvaluations = (
  ingestDays: number
) => (
  dependencies: Dependencies
) => TE.TaskEither<string, DiscoveredPublishedEvaluations>;
