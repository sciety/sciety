import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { DomainEvent, isListCreatedEvent } from '../../domain-events';
import { ListId } from '../../types/list-id';

export type AllListsResource = ReadonlyArray<ListId>;

export const replayAllLists = (events: ReadonlyArray<DomainEvent>): AllListsResource => pipe(
  events,
  RA.filter(isListCreatedEvent),
  RA.map(({ listId }) => listId),
);
