import { Json } from 'fp-ts/Json';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import * as RA from 'fp-ts/ReadonlyArray';
import { CollectedPorts } from './collected-ports';
import { commitEvents } from './commit-events';
import { dispatcher } from '../shared-read-models/dispatcher';
import { fetchData } from './fetchers';
import { getEventsFromDatabase } from './get-events-from-database';
import {
  createLogger, Logger, Config as LoggerConfig,
} from './logger';
import { stubAdapters } from '../third-parties/stubs';
import { addArticleToListCommandHandler } from '../write-side/add-article-to-list';
import {
  DomainEvent, sort as sortEvents,
} from '../domain-events';
import { editListDetailsCommandHandler } from '../write-side/command-handlers';
import { createListCommandHandler } from '../write-side/create-list';
import { executePolicies } from '../policies/execute-policies';
import { recordSubjectAreaCommandHandler } from '../write-side/record-subject-area';
import { removeArticleFromListCommandHandler } from '../write-side/remove-article-from-list';
import * as external from '../third-parties';

type Dependencies = LoggerConfig & {
  crossrefApiBearerToken: O.Option<string>,
};

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

export const createInfrastructure = (dependencies: Dependencies): TE.TaskEither<unknown, CollectedPorts> => pipe(
  {
    pool: new Pool(),
    logger: createLogger(dependencies),
  },
  TE.right,
  TE.chainFirst(createEventsTable),
  TE.chainW(({ pool, logger }) => pipe(
    getEventsFromDatabase(pool, logger),
    TE.map(RA.toArray),
    TE.map(sortEvents),
    TE.map((events) => (
      {
        events,
        pool,
        logger,
        getJson: createGetJson(logger),
      }
    )),
  )),
  TE.chain((partialAdapters) => TE.tryCatch(
    async () => {
      const {
        events, logger, pool, getJson,
      } = partialAdapters;

      const getAllEvents = T.of(events);

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

      const externalQueries = external.instantiate({
        getJson,
        logger,
        crossrefApiBearerToken: dependencies.crossrefApiBearerToken,
      });

      const collectedAdapters = {
        ...queries,
        ...externalQueries,
        getAllEvents,
        recordSubjectArea: recordSubjectAreaCommandHandler(commandHandlerAdapters),
        editListDetails: editListDetailsCommandHandler(commandHandlerAdapters),
        createList: createListCommandHandler(commandHandlerAdapters),
        addArticleToList: addArticleToListCommandHandler(commandHandlerAdapters),
        removeArticleFromList: removeArticleFromListCommandHandler(commandHandlerAdapters),
        ...partialAdapters,
      };

      const policiesAdapters = {
        ...queries,
        ...externalQueries,
        commitEvents: commitEventsWithoutListeners,
        getAllEvents: collectedAdapters.getAllEvents,
        logger: collectedAdapters.logger,
        addArticleToList: collectedAdapters.addArticleToList,
        removeArticleFromList: collectedAdapters.removeArticleFromList,
        createList: collectedAdapters.createList,
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

      if (process.env.USE_STUB_ADAPTERS === 'true') {
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
