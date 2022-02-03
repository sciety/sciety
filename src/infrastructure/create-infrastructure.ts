import { sequenceS } from 'fp-ts/Apply';
import * as A from 'fp-ts/Array';
import { Json } from 'fp-ts/Json';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import { Adapters } from './adapters';
import { commitEvents, writeEventToDatabase } from './commit-events';
import { fetchDataset } from './fetch-dataset';
import { fetchHypothesisAnnotation } from './fetch-hypothesis-annotation';
import { fetchNcrcReview } from './fetch-ncrc-review';
import { fetchRapidReview } from './fetch-rapid-review';
import { fetchReview } from './fetch-review';
import { fetchStaticFile } from './fetch-static-file';
import { fetchData } from './fetchers';
import { getCachedAxiosRequest } from './get-cached-axios-request';
import { getEventsFromDatabase } from './get-events-from-database';
import { getHtml } from './get-html';
import {
  jsonSerializer, Logger, loggerIO, rTracerLogger, streamLogger,
} from './logger';
import { needsToBeAdded } from './needs-to-be-added';
import { bootstrapGroups } from '../data/bootstrap-groups';
import {
  byDate, isArticleAddedToListEvent, isEvaluationRecordedEvent, RuntimeGeneratedEvent,
} from '../domain-events';
import { listCreationEvents } from '../shared-read-models/lists/list-creation-data';
import { getArticleVersionEventsFromBiorxiv } from '../third-parties/biorxiv';
import { fetchCrossrefArticle } from '../third-parties/crossref';
import { fetchDataciteReview } from '../third-parties/datacite';
import { searchEuropePmc } from '../third-parties/europe-pmc';
import { fetchPrelightsHighlight } from '../third-parties/prelights';
import {
  getTwitterResponse, getTwitterUserDetails, getTwitterUserDetailsBatch, getTwitterUserId,
} from '../third-parties/twitter';

type Dependencies = {
  prettyLog: boolean,
  logLevel: string, // TODO: Make this a level name
  crossrefApiBearerToken: O.Option<string>,
  twitterApiBearerToken: string,
};

const executePolicies = (logger: Logger) => (event: RuntimeGeneratedEvent) => {
  if (isEvaluationRecordedEvent(event)) {
    logger('info', 'EvaluationRecorded event triggered AddArticleToEvaluatedArticlesList policy', { event });
  }
  return T.of(undefined);
};

export const createInfrastructure = (dependencies: Dependencies): TE.TaskEither<unknown, Adapters> => pipe(
  {
    logger: pipe(
      dependencies.prettyLog,
      jsonSerializer,
      (serializer) => streamLogger(process.stdout, serializer, dependencies.logLevel),
      rTracerLogger,
    ),
    pool: new Pool(),
  },
  TE.right,
  TE.chainFirst(({ pool }) => TE.tryCatch(
    async () => pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id uuid,
        type varchar,
        date timestamp,
        payload jsonb,
        PRIMARY KEY (id)
      );
    `),
    identity,
  )),
  TE.chainW(({ pool, logger }) => pipe(
    {
      eventsFromDatabase: pipe(
        getEventsFromDatabase(pool, loggerIO(logger)),
        TE.chainW((events) => pipe(
          [],
          TE.right,
          TE.map(RA.filter(isArticleAddedToListEvent)),
          TE.map(RA.filter(needsToBeAdded(events))),
          TE.chainFirstTaskK(T.traverseArray(writeEventToDatabase(pool))),
          TE.map((eventsToAdd) => [
            ...events,
            ...eventsToAdd,
          ]),
        )),
      ),
      groupEvents: pipe(
        bootstrapGroups,
        TE.right,
      ),
    },
    sequenceS(TE.ApplyPar),
    TE.map(({ eventsFromDatabase, groupEvents }) => (
      {
        events: pipe(
          [
            ...eventsFromDatabase,
            ...groupEvents,
            ...listCreationEvents,
          ],
          A.sort(byDate),
        ),
        pool,
        logger,
      }
    )),
  )),
  TE.chain((adapters) => TE.tryCatch(
    async () => {
      const { events, logger, pool } = adapters;

      const getJson = async (uri: string) => {
        const response = await fetchData(logger)<Json>(uri);
        return response.data;
      };

      const getAllEvents = T.of(events);
      const fetchFile = fetchStaticFile(loggerIO(logger));
      const fetchers = {
        doi: fetchDataciteReview(fetchDataset(logger), logger),
        hypothesis: fetchHypothesisAnnotation(getJson, logger),
        ncrc: fetchNcrcReview(logger),
        prelights: fetchPrelightsHighlight(getHtml(logger)),
        rapidreviews: fetchRapidReview(logger, getHtml(logger)),
      };

      return {
        fetchArticle: fetchCrossrefArticle(
          getCachedAxiosRequest(logger),
          logger,
          dependencies.crossrefApiBearerToken,
        ),
        fetchReview: fetchReview(fetchers),
        fetchStaticFile: fetchFile,
        searchEuropePmc: searchEuropePmc({ getJson, logger }),
        getAllEvents,
        commitEvents: (eventsToCommit) => pipe(
          eventsToCommit,
          commitEvents({ inMemoryEvents: events, pool, logger }),
          T.chainFirst(() => pipe(
            eventsToCommit,
            T.traverseArray(executePolicies(logger)),
          )),
        ),
        getUserDetails: getTwitterUserDetails(
          getTwitterResponse(dependencies.twitterApiBearerToken, logger),
          logger,
        ),
        getUserDetailsBatch: getTwitterUserDetailsBatch(
          getTwitterResponse(dependencies.twitterApiBearerToken, logger),
          logger,
        ),
        getUserId: getTwitterUserId(
          getTwitterResponse(dependencies.twitterApiBearerToken, logger),
          logger,
        ),
        findVersionsForArticleDoi: getArticleVersionEventsFromBiorxiv({
          getJson: getCachedAxiosRequest(logger),
          logger,
        }),
        ...adapters,
      };
    },
    identity,
  )),
);
