import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { getLastEventRelevantToThisListPromotion } from './get-last-event-relevant-to-this-list-promotion';
import { constructEvent, isEventOfType } from '../../../domain-events';
import { RemoveListPromotionCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

export const remove: ResourceAction<RemoveListPromotionCommand> = (command) => (events) => pipe(
  events,
  getLastEventRelevantToThisListPromotion(command),
  O.match(
    () => [],
    (event) => (isEventOfType('ListPromotionCreated')(event) ? [constructEvent('ListPromotionRemoved')({
      byGroup: command.forGroup,
      listId: command.listId,
    })] : []),
  ),
  E.right,
);
