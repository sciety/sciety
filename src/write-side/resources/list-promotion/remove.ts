import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent, isEventOfType } from '../../../domain-events';
import { RemoveListPromotionCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

export const remove: ResourceAction<RemoveListPromotionCommand> = (command) => (events) => pipe(
  events,
  RA.filter(isEventOfType('ListPromotionRemoved')),
  RA.match(
    () => [constructEvent('ListPromotionRemoved')({
      byGroup: command.forGroup,
      listId: command.listId,
    })],
    () => [],
  ),
  E.right,
);
