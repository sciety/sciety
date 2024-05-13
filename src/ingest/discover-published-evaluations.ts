import * as TE from 'fp-ts/TaskEither';
import { FetchData } from './fetch-data';
import { DiscoveredPublishedEvaluations } from './types/discovered-published-evaluations';

type Dependencies = { fetchData: FetchData };

export type DiscoverPublishedEvaluations = (
  ingestDays: number
) => (
  dependencies: Dependencies
) => TE.TaskEither<string, DiscoveredPublishedEvaluations>;
