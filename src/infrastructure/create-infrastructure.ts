import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import { createClient } from 'redis';
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
import { Logger } from '../logger';
import { dispatcher } from '../read-models';
import {
  ExternalNotifications, ExternalQueries, instantiateExternalNotifications, instantiateExternalQueries,
} from '../third-parties';

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

const instantiateExternalAdapters = (
  config: InfrastructureConfig,
  logger: Logger,
  redisClient: ReturnType<typeof createClient> | undefined,
): ExternalQueries & ExternalNotifications => {
  const externalQueries = instantiateExternalQueries(
    logger,
    config.crossrefApiBearerToken,
    redisClient,
  );
  const externalNotifications = instantiateExternalNotifications(logger);
  let externalAdapters: ExternalQueries & ExternalNotifications;

  if (config.useStubAdapters) {
    externalAdapters = stubAdapters;
  } else if (config.useStubAvatars) {
    externalAdapters = {
      ...externalQueries,
      ...externalNotifications,
      fetchUserAvatarUrl: stubAdapters.fetchUserAvatarUrl,
    };
  } else {
    externalAdapters = {
      ...externalQueries,
      ...externalNotifications,
    };
  }
  return externalAdapters;
};

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

      const internalAdapters = {
        ...queries,
        logger: partialAdapters.logger,
        getAllEvents,
        commitEvents: commitEventsWithoutListeners,
      };

      const redisClient = await createRedisClient(partialAdapters.logger);
      const externalAdapters = instantiateExternalAdapters(config, partialAdapters.logger, redisClient);

      return {
        ...internalAdapters,
        ...externalAdapters,
      };
    },
    identity,
  )),
);
