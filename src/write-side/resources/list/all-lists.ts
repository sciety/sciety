import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { DomainEvent, isEventOfType } from '../../../domain-events';
import { ListId } from '../../../types/list-id';

type AllListsResource = ReadonlyArray<ListId>;

export const replayAllLists = (events: ReadonlyArray<DomainEvent>): AllListsResource => pipe(
  events,
  RA.filter(isEventOfType('ListCreated')),
  RA.map(({ listId }) => listId),
);
