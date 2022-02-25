import * as A from 'fp-ts/Array';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import { getListsEventsFromDatabase } from './get-lists-events-from-database';
import { ListsEvent } from './lists-event';
import { byDate } from '../domain-events';
import { Logger, loggerIO } from '../infrastructure/logger';
import { listCreationEvents } from '../shared-read-models/lists/list-creation-data';

export type GetListsEvents = TE.TaskEither<Error, ReadonlyArray<ListsEvent>>;

export const getListsEvents = (pool: Pool, logger: Logger): GetListsEvents => pipe(
  getListsEventsFromDatabase(pool, loggerIO(logger)),
  TE.map((eventsFromDatabase) => [
    ...eventsFromDatabase,
    ...listCreationEvents,
  ]),
  TE.map(A.sort(byDate)),
);
