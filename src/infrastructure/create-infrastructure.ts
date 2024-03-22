import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import * as RA from 'fp-ts/ReadonlyArray';
import { persistEventsToPostgres } from './persist-events-to-postgres';
import { CollectedPorts } from './collected-ports';
import { createCommitEvents } from './create-commit-events';
import { dispatcher } from '../read-models';
import { getEventsFromDatabase } from './get-events-from-database';
import {
  createLogger, Config as LoggerConfig,
} from './logger';
import { stubAdapters } from './stub-adapters';
import { addArticleToListCommandHandler } from '../write-side/command-handlers/add-article-to-list-command-handler';
import {
  editListDetailsCommandHandler,
  createListCommandHandler,
  recordSubjectAreaCommandHandler,
  removeArticleFromListCommandHandler,
} from '../write-side/command-handlers';
import { instantiate } from '../third-parties';
import { createRedisClient } from './create-redis-client';
import { Logger } from '../infrastructure-contract';
import { sortEvents } from '../process-contract';

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

      const commitEvents = createCommitEvents({
        inMemoryEvents: partialAdapters.events,
        dispatchToAllReadModels,
        persistEvents: persistEventsToPostgres(partialAdapters.pool),
        logger: partialAdapters.logger,
      });

      const commandHandlerAdapters = {
        getAllEvents,
        commitEvents,
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
        commitEvents,
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
