import { sequenceS } from 'fp-ts/Apply';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CrossrefWork } from './crossref-work';
import { enqueueAllRelatedDoisNotYetCollected } from './enqueue-all-related-dois-not-yet-collected';
import { fetchIndividualWork } from './fetch-individual-work';
import { fetchWorksThatPointToIndividualWorks } from './fetch-works-that-point-to-individual-works';
import { QueryCrossrefService } from './query-crossref-service';
import { collectWorksIntoStateAndEmptyQueue, State } from './state';
import { Logger } from '../../../logger';
import * as DE from '../../../types/data-error';

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
  TE.map(collectWorksIntoStateAndEmptyQueue(state)),
);

export type Config = {
  recursionLimit: number,
  collectedWorksSizeLimit: number,
};

export const walkRelationGraph = (
  queryCrossrefService: QueryCrossrefService,
  logger: Logger,
  doi: string,
  config: Config,
) => (
  state: State,
): TE.TaskEither<DE.DataError | 'too-much-recursion', ReadonlyArray<CrossrefWork>> => {
  if (state.recursionCount > config.recursionLimit) {
    logger('error', 'Exiting recursion due to potential infinite loop', {
      queue: state.queue,
      collectedWorksSize: state.collectedWorks.size,
      startingDoi: doi,
    });
    return TE.left('too-much-recursion' as const);
  }
  if (state.collectedWorks.size > config.collectedWorksSizeLimit) {
    logger('warn', 'Exiting recursion early due to danger of an infinite loop', {
      collectedWorksSize: state.collectedWorks.size,
      startingDoi: doi,
    });
  }
  if (state.queue.length === 0) {
    return TE.right(Array.from(state.collectedWorks.values()));
  }
  if (state.queue.length > 15) {
    logger('warn', 'walk-relation-graph queue contains more than 15 items, could be overloading the Crossref API', {
      queueSize: state.queue.length,
      collectedWorksSize: state.collectedWorks.size,
      startingDoi: doi,
    });
  }
  if (state.collectedWorks.size > config.collectedWorksSizeLimit) {
    return TE.right(Array.from(state.collectedWorks.values()));
  }

  return pipe(
    state,
    fetchAllQueuedWorksAndAddToCollector(queryCrossrefService, logger),
    TE.map(enqueueAllRelatedDoisNotYetCollected),
    TE.flatMap(walkRelationGraph(queryCrossrefService, logger, doi, config)),
  );
};
