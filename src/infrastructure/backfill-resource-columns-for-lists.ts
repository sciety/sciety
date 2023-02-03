import { Pool } from 'pg';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import * as M from 'fp-ts/Map';
import { Eq as stringEq } from 'fp-ts/string';
import * as O from 'fp-ts/Option';
import { DomainEvent } from '../domain-events';
import { EventId } from '../types/event-id';
import { ListId } from '../types/list-id';
import { filterByName, SubsetOfDomainEvent } from '../domain-events/domain-event';

type BackfillDataForSingleEvent = {
  resourceId: ListId,
  resourceVersion: number,
  eventId: EventId,
};

type BackfillDataForAllList = Map<ListId, Array<BackfillDataForSingleEvent>>;

const updateListResourceBackfillData = (
  state: BackfillDataForAllList,
  event: SubsetOfDomainEvent<typeof namesOfEventsOwnedByListResource>,
): BackfillDataForAllList => {
  const updatedResource = pipe(
    state,
    M.lookup(stringEq)(event.listId),
    O.fold(
      () => [{
        resourceId: event.listId,
        resourceVersion: 0,
        eventId: event.id,
      }],
      (oldResource) => [...oldResource, {
        resourceId: event.listId,
        resourceVersion: oldResource.length,
        eventId: event.id,
      }],
    ),
  );
  state.set(event.listId, updatedResource);
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

const namesOfEventsOwnedByListResource = [
  'ListCreated' as const,
  'ArticleAddedToList' as const,
  'ArticleRemovedFromList' as const,
  'ListDescriptionEdited' as const,
  'ListNameEdited' as const,
];

export const backfillResourceColumnsForLists = (
  pool: Pool,
) => (events: Array<DomainEvent>): TE.TaskEither<Error, void> => pipe(
  events,
  filterByName(namesOfEventsOwnedByListResource),
  RA.reduce(new Map(), updateListResourceBackfillData),
  (allBackfillData) => Array.from(allBackfillData.values()),
  RA.flatten,
  TE.traverseArray(backfillResourceColumnsForListCreatedEvent(pool)),
  TE.map(() => undefined),
);
