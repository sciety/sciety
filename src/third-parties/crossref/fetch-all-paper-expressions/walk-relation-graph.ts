import { sequenceS } from 'fp-ts/Apply';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CrossrefWork } from './crossref-work';
import { enqueueAllRelatedDoisNotYetCollected } from './enqueue-all-related-dois-not-yet-collected';
import { fetchIndividualWork } from './fetch-individual-work';
import { fetchWorksThatPointToIndividualWorks } from './fetch-works-that-point-to-individual-works';
import { QueryCrossrefService } from './query-crossref-service';
import { State } from './state';
import { Logger } from '../../../shared-ports';
import * as DE from '../../../types/data-error';

const update = (collectedWorks: State['collectedWorks'], newlyFetchedWork: CrossrefWork) => {
  collectedWorks.set(newlyFetchedWork.DOI.toLowerCase(), newlyFetchedWork);
  return collectedWorks;
};

const fetchAllQueuedWorksAndAddToCollector = (
  queryCrossrefService: QueryCrossrefService,
  logger: Logger,
) => (state: State) => pipe(
  {
    individualWorks: TE.traverseArray(fetchIndividualWork(queryCrossrefService, logger))(state.queue),
    worksThatPointToIndividualWorks: fetchWorksThatPointToIndividualWorks(queryCrossrefService, logger)(state.queue),
  },
  sequenceS(TE.ApplyPar),
  TE.map((fetched) => [...fetched.individualWorks, ...fetched.worksThatPointToIndividualWorks]),
  TE.map(RA.reduce(state.collectedWorks, update)),
  TE.map((collectedWorks) => ({
    queue: [],
    collectedWorks,
  })),
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
