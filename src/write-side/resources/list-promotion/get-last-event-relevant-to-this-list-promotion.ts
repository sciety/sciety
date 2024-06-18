import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { filterByName, DomainEvent, EventOfType } from '../../../domain-events';
import { PromoteListCommand } from '../../commands';

export const getLastEventRelevantToThisListPromotion = (
  command: PromoteListCommand,
) => (
  events: ReadonlyArray<DomainEvent>,
): O.Option<EventOfType<'ListPromotionCreated'> | EventOfType<'ListPromotionRemoved'>> => pipe(
  events,
  filterByName(['ListPromotionRemoved', 'ListPromotionCreated']),
  RA.filter((event) => event.byGroup === command.forGroup && event.listId === command.listId),
  RA.last,
);
