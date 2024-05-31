import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent, filterByName, isEventOfType } from '../../../domain-events';
import { RemoveListPromotionCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

export const remove: ResourceAction<RemoveListPromotionCommand> = (command) => (events) => pipe(
  events,
  filterByName(['ListPromotionRemoved', 'ListPromotionCreated']),
  RA.filter((event) => event.byGroup === command.forGroup && event.listId === command.listId),
  RA.last,
  O.match(
    () => [],
    (event) => (isEventOfType('ListPromotionCreated')(event) ? [constructEvent('ListPromotionRemoved')({
      byGroup: command.forGroup,
      listId: command.listId,
    })] : []),
  ),
  E.right,
);
