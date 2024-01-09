import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { PaperExpression } from '../../../types/paper-expression';
import * as DE from '../../../types/data-error';
import { Logger } from '../../../shared-ports';
import { CrossrefWork } from './crossref-work';
import { State } from './state';
import { fetchWorksThatPointToIndividualWorks } from './fetch-works-that-point-to-individual-works';
import { fetchIndividualWork } from './fetch-individual-work';
import { enqueueAllRelatedDoisNotYetCollected } from './enqueue-all-related-dois-not-yet-collected';
import { QueryCrossrefService } from './query-crossref-service';
import { toPaperExpression } from './to-paper-expression';

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

const walkRelationGraph = (
  queryCrossrefService: QueryCrossrefService,
  logger: Logger,
  doi: string,
) => (
  state: State,
): TE.TaskEither<unknown, ReadonlyArray<CrossrefWork>> => pipe(
  state,
  fetchAllQueuedWorksAndAddToCollector(queryCrossrefService, logger),
  TE.map(enqueueAllRelatedDoisNotYetCollected),
  TE.chain((s) => {
    if (s.queue.length === 0) {
      return TE.right(Array.from(s.collectedWorks.values()));
    }
    if (s.collectedWorks.size > 20) {
      logger('warn', 'Exiting recursion early due to danger of an infinite loop', {
        collectedWorksSize: s.collectedWorks.size,
        startingDoi: doi,
      });

      return TE.left(DE.unavailable);
    }
    return walkRelationGraph(queryCrossrefService, logger, doi)(s);
  }),
);

const logWhenExpressionServerIsUnsupported = (logger: Logger) => (expression: PaperExpression) => {
  if (O.isNone(expression.server)) {
    logger('warn', 'Paper expression server not known', {
      expressionDoi: expression.expressionDoi,
      publisherHtmlUrl: expression.publisherHtmlUrl,
    });
  }
  return expression;
};

type FetchAllPaperExpressions = (queryCrossrefService: QueryCrossrefService, logger: Logger, doi: string)
=> TO.TaskOption<RNEA.ReadonlyNonEmptyArray<PaperExpression>>;

export const fetchAllPaperExpressions: FetchAllPaperExpressions = (
  queryCrossrefService,
  logger,
  doi,
) => pipe(
  {
    queue: [doi],
    collectedWorks: new Map(),
  },
  walkRelationGraph(queryCrossrefService, logger, doi),
  TO.fromTaskEither,
  TO.map(RA.map(toPaperExpression)),
  TO.map(RA.map(logWhenExpressionServerIsUnsupported(logger))),
  TO.chainOptionK(RNEA.fromReadonlyArray),
);
