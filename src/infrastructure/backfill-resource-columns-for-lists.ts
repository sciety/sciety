import { Pool } from 'pg';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { DomainEvent, isListCreatedEvent, ListCreatedEvent } from '../domain-events';
import { EventId } from '../types/event-id';
import { ListId } from '../types/list-id';

type BackfillDataForSingleEvent = {
  resourceId: ListId,
  resourceVersion: number,
  eventId: EventId,
};

type BackfillDataForAllList = Map<ListId, Array<BackfillDataForSingleEvent>>;

const updateListResourceBackfillData = (
  state: BackfillDataForAllList,
  event: ListCreatedEvent,
): BackfillDataForAllList => {
  state.set(event.listId, [{ resourceId: event.listId, resourceVersion: 0, eventId: event.id }]);
  return state;
};

const backfillResourceColumnsForListCreatedEvent = (
  pool: Pool,
) => (backfillData: BackfillDataForSingleEvent) => TE.tryCatch(
  async () => pool.query(`
      UPDATE events
        SET resource_name = 'List',
          resource_id = $1,
          resource_version = $2
        WHERE id = $3
    `,
  [backfillData.resourceId, backfillData.resourceVersion, backfillData.eventId]),
  E.toError,
);

export const backfillResourceColumnsForLists = (
  pool: Pool,
) => (events: Array<DomainEvent>): TE.TaskEither<Error, void> => pipe(
  events,
  RA.filter(isListCreatedEvent),
  RA.reduce(new Map(), updateListResourceBackfillData),
  (allBackfillData) => Array.from(allBackfillData.values()),
  RA.flatten,
  TE.traverseArray(backfillResourceColumnsForListCreatedEvent(pool)),
  TE.map(() => undefined),
);
