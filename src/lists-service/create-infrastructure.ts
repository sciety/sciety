import { sequenceS } from 'fp-ts/Apply';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import { Adapters } from './adapters';
import { bootstrapGroups } from '../data/bootstrap-groups';
import {
  byDate,
} from '../domain-events';
import { getEventsFromDatabase } from '../infrastructure/get-events-from-database';
import {
  jsonSerializer, loggerIO, rTracerLogger, streamLogger,
} from '../infrastructure/logger';
import { listCreationEvents } from '../shared-read-models/lists/list-creation-data';

type Dependencies = {
  prettyLog: boolean,
  logLevel: string, // TODO: Make this a level name
  crossrefApiBearerToken: O.Option<string>,
  twitterApiBearerToken: string,
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
      const { events } = adapters;

      const getAllEvents = T.of(events);

      return {
        getAllEvents,
        ...adapters,
      };
    },
    identity,
  )),
);
