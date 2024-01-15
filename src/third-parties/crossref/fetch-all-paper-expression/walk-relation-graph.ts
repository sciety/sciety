import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../../../types/data-error';
import { Logger } from '../../../shared-ports';
import { CrossrefWork } from './crossref-work';
import { State } from './state';
import { fetchWorksThatPointToIndividualWorks } from './fetch-works-that-point-to-individual-works';
import { fetchIndividualWork } from './fetch-individual-work';
import { enqueueAllRelatedDoisNotYetCollected } from './enqueue-all-related-dois-not-yet-collected';
import { QueryCrossrefService } from './query-crossref-service';

const fetchAllQueuedWorksAndAddToCollector = (
  queryCrossrefService: QueryCrossrefService,
  logger: Logger,
) => (state: State) => pipe(
  state.queue,
  TE.traverseArray(fetchIndividualWork(queryCrossrefService, logger)),
  TE.chainW((individualWorks) => pipe(
    state.queue,
    fetchWorksThatPointToIndividualWorks(queryCrossrefService, logger),
    TE.map((worksThatPointToIndividualWorks) => [...individualWorks, ...worksThatPointToIndividualWorks]),
  )),
  TE.map((newlyFetchedWorks) => pipe(
    newlyFetchedWorks,
    RA.reduce(
      state.collectedWorks,
      (collectedWorks, newlyFetchedWork) => {
        collectedWorks.set(newlyFetchedWork.DOI.toLowerCase(), newlyFetchedWork);
        return collectedWorks;
      },
    ),
    (collectedWorks) => ({
      queue: [],
      collectedWorks,
    }),
  )),
);

export const walkRelationGraph = (
  queryCrossrefService: QueryCrossrefService,
  logger: Logger,
  doi: string,
) => (
  state: State,
): TE.TaskEither<DE.DataError, ReadonlyArray<CrossrefWork>> => {
  if (state.collectedWorks.size > 20) {
    logger('warn', 'Exiting recursion early due to danger of an infinite loop', {
      collectedWorksSize: state.collectedWorks.size,
      startingDoi: doi,
    });
  }
  if (state.queue.length === 0 || state.collectedWorks.size > 20) {
    return TE.right(Array.from(state.collectedWorks.values()));
  }

  return pipe(
    state,
    fetchAllQueuedWorksAndAddToCollector(queryCrossrefService, logger),
    TE.map(enqueueAllRelatedDoisNotYetCollected),
    TE.chain(walkRelationGraph(queryCrossrefService, logger, doi)),
  );
};
