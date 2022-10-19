import { sequenceS } from 'fp-ts/Apply';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import { appendNewListsEventsFromDatabase } from './append-new-lists-events-from-database';
import { getListsEventsFromDatabase } from './get-lists-events-from-database';
import { Ports } from './ports';
import { queryDatabaseForEventsWithNewerDate } from './query-database-for-events-with-newer-date';
import { hardcodedListCreationEvents } from '../data/hardcoded-list-creation-events';
import { sort as sortEvents } from '../domain-events';
import {
  jsonSerializer, rTracerLogger,
  streamLogger,
} from '../infrastructure/logger';

type Dependencies = {
  prettyLog: boolean,
  logLevel: string, // TODO: Make this a level name
};

export const defaultCheckpoint = (): Date => new Date('1970');

export const createInfrastructure = (dependencies: Dependencies): TE.TaskEither<unknown, Ports> => pipe(
  {
    pool: new Pool(),
    logger: pipe(
      dependencies.prettyLog,
      jsonSerializer,
      (serializer) => streamLogger(process.stdout, serializer, dependencies.logLevel),
      rTracerLogger,
    ),
  },
  ({ pool, logger }) => (
    {
      eventsAvailableAtStartup: pipe(
        getListsEventsFromDatabase(pool, logger),
        TE.map((eventsFromDatabase) => [
          ...eventsFromDatabase,
          ...hardcodedListCreationEvents(),
        ]),
        TE.map(sortEvents),
      ),
      pool: TE.right(pool),
      logger: TE.right(logger),
    }
  ),
  sequenceS(TE.ApplyPar),
  TE.map(({ pool, logger, eventsAvailableAtStartup }) => ({
    getListsEvents: pipe(
      eventsAvailableAtStartup,
      appendNewListsEventsFromDatabase(pool, logger),
      TE.map(RA.toArray),
      TE.map(sortEvents),
    ),
    eventsAvailableAtStartup,
    getNewListsEvents: (checkpoint) => pipe(
      checkpoint,
      queryDatabaseForEventsWithNewerDate(pool, logger),
      TE.map(RA.toArray),
      TE.map(sortEvents),
    ),
    logger,
  })),
);
