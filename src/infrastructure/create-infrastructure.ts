import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import { CollectedPorts } from './collected-ports';
import { commitEvents } from './commit-events';
import { createRedisClient } from './create-redis-client';
import { getEventsFromDatabase } from './get-events-from-database';
import {
  createLogger, Config as LoggerConfig,
} from './logger';
import { persistEvents } from './persist-events';
import { stubAdapters } from './stub-adapters';
import { sort as sortEvents } from '../domain-events';
import { dispatcher } from '../read-models';
import { Logger } from '../shared-ports';
import { instantiate } from '../third-parties';
import {
  createListCommandHandler,
  recordSubjectAreaCommandHandler,
  removeArticleFromListCommandHandler,
} from '../write-side/command-handlers';
import { addArticleToListCommandHandler } from '../write-side/command-handlers/add-article-to-list-command-handler';

type InfrastructureConfig = LoggerConfig & {
  crossrefApiBearerToken: O.Option<string>,
  useStubAdapters: boolean,
  useStubAvatars: boolean,
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

export const createInfrastructure = (
  config: InfrastructureConfig,
): TE.TaskEither<unknown, CollectedPorts> => pipe(
  {
    pool: new Pool(),
    logger: createLogger(config),
  },
  TE.right,
  TE.map((adapters) => {
    adapters.logger('info', 'Database connection pool and logger available', { databaseHost: process.env.PGHOST });
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

      const externalQueries = instantiate(
        partialAdapters.logger,
        config.crossrefApiBearerToken,
        redisClient,
      );

      const collectedAdapters = {
        ...queries,
        ...externalQueries,
        ...partialAdapters,
        getAllEvents,
        recordSubjectArea: recordSubjectAreaCommandHandler(commandHandlerAdapters),
        createList: createListCommandHandler(commandHandlerAdapters),
        addArticleToList: addArticleToListCommandHandler(commandHandlerAdapters),
        removeArticleFromList: removeArticleFromListCommandHandler(commandHandlerAdapters),
      };

      const allAdapters = {
        ...collectedAdapters,
        commitEvents: commitEventsWithoutListeners,
      };

      if (config.useStubAdapters) {
        return {
          ...allAdapters,
          ...stubAdapters,
        };
      }
      if (config.useStubAvatars) {
        return {
          ...allAdapters,
          fetchUserAvatarUrl: stubAdapters.fetchUserAvatarUrl,
        };
      }
      return allAdapters;
    },
    identity,
  )),
);
