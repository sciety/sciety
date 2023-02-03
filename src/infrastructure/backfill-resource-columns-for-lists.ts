import { Pool } from 'pg';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { DomainEvent, isListCreatedEvent } from '../domain-events';
import { EventId } from '../types/event-id';
import { ListId } from '../types/list-id';

type BackfillData = {
  eventId: EventId,
  resourceId: ListId,
};

const backfillResourceColumnsForListCreatedEvent = (pool: Pool) => (backfillData: BackfillData) => TE.tryCatch(
  async () => pool.query(`
      UPDATE events
        SET resource_name = 'List',
          resource_id = $1
        WHERE id = $2
    `,
  [backfillData.resourceId, backfillData.eventId]),
  E.toError,
);

export const backfillResourceColumnsForLists = (
  pool: Pool,
) => (events: Array<DomainEvent>): TE.TaskEither<Error, void> => pipe(
  events,
  RA.filter(isListCreatedEvent),
  RA.map(({ id, listId }) => ({ eventId: id, resourceId: listId })),
  TE.traverseArray(backfillResourceColumnsForListCreatedEvent(pool)),
  TE.map(() => undefined),
);
