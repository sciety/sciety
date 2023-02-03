import { Pool } from 'pg';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { DomainEvent, isListCreatedEvent } from '../domain-events';
import { EventId } from '../types/event-id';

const backfillResourceColumnsForListCreatedEvent = (pool: Pool) => (eventId: EventId) => TE.tryCatch(
  async () => pool.query(`
      UPDATE events
        SET resource_name = 'List'
        WHERE id = $1
    `,
  [eventId]),
  E.toError,
);

export const backfillResourceColumnsForLists = (
  pool: Pool,
) => (events: Array<DomainEvent>): TE.TaskEither<Error, void> => pipe(
  events,
  RA.filter(isListCreatedEvent),
  RA.map(({ id }) => id),
  TE.traverseArray(backfillResourceColumnsForListCreatedEvent(pool)),
  TE.map(() => undefined),
);
