import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import { ListsEvent } from './lists-event';
import { queryDatabaseForEventsWithNewerDate } from './query-database-for-events-with-newer-date';
import { Logger, loggerIO } from '../infrastructure/logger';

const defaultCheckpoint = () => new Date('1970');

type AppendNewListsEventsFromDatabase = (pool: Pool, logger: Logger) => (listEvents: ReadonlyArray<ListsEvent>)
=> TE.TaskEither<Error, ReadonlyArray<ListsEvent>>;

export const appendNewListsEventsFromDatabase: AppendNewListsEventsFromDatabase = (
  pool, logger,
) => (sortedListEvents) => pipe(
  sortedListEvents,
  RA.last,
  O.map((event) => event.date),
  O.getOrElse(defaultCheckpoint),
  queryDatabaseForEventsWithNewerDate(pool, loggerIO(logger)),
  TE.map((newEvents) => RA.concat(newEvents)(sortedListEvents)),
);
