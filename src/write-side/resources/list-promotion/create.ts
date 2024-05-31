import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent, isEventOfType, filterByName } from '../../../domain-events';
import { PromoteListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

export const create: ResourceAction<PromoteListCommand> = (command) => (events) => pipe(
  events,
  filterByName(['ListPromotionRemoved', 'ListPromotionCreated']),
  RA.filter((event) => event.byGroup === command.forGroup && event.listId === command.listId),
  RA.last,
  O.match(
    () => [constructEvent('ListPromotionCreated')({
      byGroup: command.forGroup,
      listId: command.listId,
    })],
    (event) => (isEventOfType('ListPromotionRemoved')(event) ? [constructEvent('ListPromotionCreated')({
      byGroup: command.forGroup,
      listId: command.listId,
    })] : []),
  ),
  E.right,
);
