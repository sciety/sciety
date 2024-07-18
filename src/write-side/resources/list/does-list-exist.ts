import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, filterByName, isEventOfType } from '../../../domain-events';
import { ListId } from '../../../types/list-id';

export const doesListExist = (listId: ListId) => (events: ReadonlyArray<DomainEvent>): boolean => pipe(
  events,
  filterByName(['ListCreated', 'ListDeleted']),
  RA.filter((event) => event.listId === listId),
  RA.last,
  O.filter(isEventOfType('ListCreated')),
  O.match(
    () => false,
    () => true,
  ),
);
