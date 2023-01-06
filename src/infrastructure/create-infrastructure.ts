import { Json } from 'fp-ts/Json';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import { CollectedPorts } from './collected-ports';
import { commitEvents, writeEventToDatabase } from './commit-events';
import { dispatcher } from './dispatcher';
import { fetchHypothesisAnnotation } from './fetch-hypothesis-annotation';
import { fetchNcrcReview } from './fetch-ncrc-review';
import { fetchRapidReview } from './fetch-rapid-review';
import { fetchReview } from './fetch-review';
import { fetchStaticFile } from './fetch-static-file';
import { fetchZenodoRecord } from './fetch-zenodo-record';
import { fetchData } from './fetchers';
import { getCachedAxiosRequest } from './get-cached-axios-request';
import { getEventsFromDatabase } from './get-events-from-database';
import { getHtml } from './get-html';
import {
  jsonSerializer, Logger, loggerIO, rTracerLogger, streamLogger,
} from './logger';
import { needsToBeAdded } from './needs-to-be-added';
import { stubAdapters } from './stub-adapters';
import { addArticleToListCommandHandler } from '../add-article-to-list';
import { AppConfig } from '../app-config';
import { bootstrapGroups as groupJoinedEvents } from '../data/bootstrap-groups';
import { hardcodedListCreationEvents } from '../data/hardcoded-list-creation-events';
import {
  DomainEvent,
  isListCreatedEvent, sort as sortEvents,
} from '../domain-events';
import { editListDetailsCommandHandler } from '../edit-list-details';
import { createListCommandHandler } from '../lists';
import { executePolicies } from '../policies/execute-policies';
import { recordSubjectAreaCommandHandler } from '../record-subject-area';
import { removeArticleFromListCommandHandler } from '../remove-article-from-list';
import { getArticleVersionEventsFromBiorxiv } from '../third-parties/biorxiv';
import { getBiorxivOrMedrxivCategory } from '../third-parties/biorxiv/get-biorxiv-or-medrxiv-category';
import { fetchCrossrefArticle } from '../third-parties/crossref';
import { searchEuropePmc } from '../third-parties/europe-pmc';
import { fetchPrelightsHighlight } from '../third-parties/prelights';
import {
  getTwitterResponse, getTwitterUserDetails, getTwitterUserDetailsBatch, getTwitterUserId,
} from '../third-parties/twitter';

const createLogger = (config: AppConfig) => pipe(
  config.PRETTY_LOG,
  jsonSerializer,
  (serializer) => streamLogger(process.stdout, serializer, config.LOG_LEVEL),
  rTracerLogger,
);

type DatabaseConnectionPoolAndLogger = { pool: Pool, logger: Logger };

const createEventsTable = ({ pool }: DatabaseConnectionPoolAndLogger) => TE.tryCatch(
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
);

const createGetJson = (logger: Logger) => async (uri: string) => {
  const response = await fetchData(logger)<Json>(uri);
  return response.data;
};

const createGetJsonWithTimeout = (logger: Logger, timeout: number) => async (uri: string) => {
  const response = await fetchData(logger, timeout)<Json>(uri);
  return response.data;
};

const addSpecifiedEventsFromCodeIntoDatabaseAndAppend = (
  pool: Pool,
) => (
  events: ReadonlyArray<DomainEvent>,
) => pipe(
  [],
  TE.right,
  TE.map(RA.filter(isListCreatedEvent)),
  TE.map(RA.filter(needsToBeAdded(events))),
  TE.chainFirstTaskK(T.traverseArray(writeEventToDatabase(pool))),
  TE.map((eventsToAdd) => [
    ...events,
    ...eventsToAdd,
  ]),
);

export const createInfrastructure = (config: AppConfig): TE.TaskEither<unknown, CollectedPorts> => pipe(
  {
    pool: new Pool({
      user: config.PGUSER,
      host: config.PGHOST,
      password: config.PGPASSWORD,
      database: config.PGDATABASE,
    }),
    logger: createLogger(config),
  },
  TE.right,
  TE.chainFirst(createEventsTable),
  TE.chainW(({ pool, logger }) => pipe(
    getEventsFromDatabase(pool, logger),
    TE.chainW(addSpecifiedEventsFromCodeIntoDatabaseAndAppend(pool)),
    TE.map((eventsFromDatabase) => pipe(
      [
        ...eventsFromDatabase,
        ...groupJoinedEvents,
        ...hardcodedListCreationEvents(),
      ],
      sortEvents,
    )),
    TE.map((events) => (
      {
        events,
        pool,
        logger,
        getJson: createGetJson(logger),
      }
    )),
  )),
  TE.map((lowLevelAdapters) => ({
    ...lowLevelAdapters,
    getArticleSubjectArea: getBiorxivOrMedrxivCategory({
      getJson: createGetJsonWithTimeout(lowLevelAdapters.logger, 10000),
      logger: lowLevelAdapters.logger,
    }),
  })),
  TE.chain((partialAdapters) => TE.tryCatch(
    async () => {
      const {
        events, logger, pool, getJson,
      } = partialAdapters;

      const getAllEvents = T.of(events);
      const fetchers = {
        doi: fetchZenodoRecord(getJson, logger),
        hypothesis: fetchHypothesisAnnotation(getCachedAxiosRequest(logger, 5 * 60 * 1000), logger),
        ncrc: fetchNcrcReview(logger),
        prelights: fetchPrelightsHighlight(getHtml(logger)),
        rapidreviews: fetchRapidReview(logger, getHtml(logger)),
      };

      const {
        dispatchToAllReadModels,
        queries,
      } = dispatcher();

      dispatchToAllReadModels(events);

      const commitEventsWithoutListeners = commitEvents({
        inMemoryEvents: events,
        dispatchToAllReadModels,
        pool,
        logger,
      });

      const commandHandlerAdapters = {
        getAllEvents,
        commitEvents: commitEventsWithoutListeners,
      };

      const collectedAdapters = {
        ...queries,
        fetchArticle: fetchCrossrefArticle(
          getCachedAxiosRequest(logger),
          logger,
          config.CROSSREF_API_BEARER_TOKEN,
        ),
        fetchReview: fetchReview(fetchers),
        fetchStaticFile: fetchStaticFile(loggerIO(logger)),
        searchEuropePmc: searchEuropePmc({ getJson, logger }),
        getAllEvents,
        getUserDetails: getTwitterUserDetails(
          getTwitterResponse(config.TWITTER_API_BEARER_TOKEN, logger),
          logger,
        ),
        getUserDetailsBatch: getTwitterUserDetailsBatch(
          getTwitterResponse(config.TWITTER_API_BEARER_TOKEN, logger),
          logger,
        ),
        getUserId: getTwitterUserId(
          getTwitterResponse(config.TWITTER_API_BEARER_TOKEN, logger),
          logger,
        ),
        findVersionsForArticleDoi: getArticleVersionEventsFromBiorxiv({
          getJson: getCachedAxiosRequest(logger),
          logger,
        }),
        recordSubjectArea: recordSubjectAreaCommandHandler(commandHandlerAdapters),
        editListDetails: editListDetailsCommandHandler(commandHandlerAdapters),
        createList: createListCommandHandler(commandHandlerAdapters),
        addArticleToList: addArticleToListCommandHandler(commandHandlerAdapters),
        removeArticleFromList: removeArticleFromListCommandHandler(commandHandlerAdapters),
        ...partialAdapters,
      };

      const policiesAdapters = {
        ...queries,
        commitEvents: commitEventsWithoutListeners,
        getAllEvents: collectedAdapters.getAllEvents,
        logger: collectedAdapters.logger,
        getArticleSubjectArea: collectedAdapters.getArticleSubjectArea,
        getUserDetails: collectedAdapters.getUserDetails,
        addArticleToList: collectedAdapters.addArticleToList,
        removeArticleFromList: collectedAdapters.removeArticleFromList,
        createList: collectedAdapters.createList,
        getEvaluatedArticlesListIdForGroup: collectedAdapters.getEvaluatedArticlesListIdForGroup,
      };

      const allAdapters = {
        ...collectedAdapters,
        commitEvents: (eventsToCommit: ReadonlyArray<DomainEvent>) => pipe(
          eventsToCommit,
          commitEventsWithoutListeners,
          T.chainFirst(() => pipe(
            eventsToCommit,
            T.traverseArray(executePolicies(policiesAdapters)),
          )),
        ),
      };

      if (config.USE_STUB_ADAPTERS) {
        return {
          ...allAdapters,
          ...stubAdapters,
        };
      }
      return allAdapters;
    },
    identity,
  )),
);
