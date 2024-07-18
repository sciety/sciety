import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, isEventOfType } from '../../../domain-events';
import { ListId } from '../../../types/list-id';

export const getListIdsThatHaveEverBeenUsed = (events: ReadonlyArray<DomainEvent>): ReadonlyArray<ListId> => pipe(
  events,
  RA.filter(isEventOfType('ListCreated')),
  RA.map(({ listId }) => listId),
);
