import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  constructEvent, isEventOfType, filterByName, DomainEvent,
} from '../../../domain-events';
import { PromoteListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

const promoteList = (command: PromoteListCommand) => [constructEvent('ListPromotionCreated')({
  byGroup: command.forGroup,
  listId: command.listId,
})];

const getLastEventRelevantToThisListPromotion = (
  command: PromoteListCommand,
) => (
  events: ReadonlyArray<DomainEvent>,
) => pipe(
  events,
  filterByName(['ListPromotionRemoved', 'ListPromotionCreated']),
  RA.filter((event) => event.byGroup === command.forGroup && event.listId === command.listId),
  RA.last,
);

export const create: ResourceAction<PromoteListCommand> = (command) => (events) => pipe(
  events,
  getLastEventRelevantToThisListPromotion(command),
  O.match(
    () => promoteList(command),
    (event) => (isEventOfType('ListPromotionRemoved')(event) ? promoteList(command) : []),
  ),
  E.right,
);
