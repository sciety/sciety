import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import * as RA from 'fp-ts/ReadonlyArray';
import { persistEvents } from './persist-events.js';
import { CollectedPorts } from './collected-ports.js';
import { commitEvents } from './commit-events.js';
import { dispatcher } from '../read-models/index.js';
import { getEventsFromDatabase } from './get-events-from-database.js';
import {
  createLogger, Logger, Config as LoggerConfig,
} from './logger.js';
import { stubAdapters } from './stub-adapters/index.js';
import { addArticleToListCommandHandler } from '../write-side/command-handlers/add-article-to-list-command-handler.js';
import { sort as sortEvents } from '../domain-events/index.js';
import {
  editListDetailsCommandHandler,
  createListCommandHandler,
  recordSubjectAreaCommandHandler,
  removeArticleFromListCommandHandler,
} from '../write-side/command-handlers/index.js';
import { instantiate } from '../third-parties/index.js';
import { createRedisClient } from './create-redis-client.js';

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

export const createInfrastructure = (dependencies: Dependencies): TE.TaskEither<unknown, CollectedPorts> => pipe(
  {
    pool: new Pool(),
    logger: createLogger(dependencies),
  },
  TE.right,
  TE.map((adapters) => {
    adapters.logger('info', 'Database connection pool and logger available');
    return adapters;
  }),
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
      }
    )),
  )),
  TE.chain((partialAdapters) => TE.tryCatch(
    async () => {
      const getAllEvents = T.of(partialAdapters.events);

      const {
        dispatchToAllReadModels,
        queries,
      } = dispatcher(partialAdapters.logger);

      dispatchToAllReadModels(partialAdapters.events);
      partialAdapters.logger('info', 'All read models initialized');

      const commitEventsWithoutListeners = commitEvents({
        inMemoryEvents: partialAdapters.events,
        dispatchToAllReadModels,
        persistEvents: persistEvents(partialAdapters.pool),
        logger: partialAdapters.logger,
      });

      const commandHandlerAdapters = {
        getAllEvents,
        commitEvents: commitEventsWithoutListeners,
      };

      const redisClient = await createRedisClient(partialAdapters.logger);

      const externalQueries = instantiate(partialAdapters.logger, dependencies.crossrefApiBearerToken, redisClient);

      const collectedAdapters = {
        ...queries,
        ...externalQueries,
        ...partialAdapters,
        getAllEvents,
        recordSubjectArea: recordSubjectAreaCommandHandler(commandHandlerAdapters),
        editListDetails: editListDetailsCommandHandler(commandHandlerAdapters),
        createList: createListCommandHandler(commandHandlerAdapters),
        addArticleToList: addArticleToListCommandHandler(commandHandlerAdapters),
        removeArticleFromList: removeArticleFromListCommandHandler(commandHandlerAdapters),
      };

      const allAdapters = {
        ...collectedAdapters,
        commitEvents: commitEventsWithoutListeners,
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
