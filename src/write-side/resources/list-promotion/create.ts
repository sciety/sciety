import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { getLastEventRelevantToThisListPromotion } from './get-last-event-relevant-to-this-list-promotion';
import {
  constructEvent, isEventOfType,
} from '../../../domain-events';
import { PromoteListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

const promoteList = (command: PromoteListCommand) => [constructEvent('ListPromotionCreated')({
  byGroup: command.forGroup,
  listId: command.listId,
})];

export const create: ResourceAction<PromoteListCommand> = (command) => (events) => pipe(
  events,
  getLastEventRelevantToThisListPromotion(command),
  O.match(
    () => promoteList(command),
    (event) => (isEventOfType('ListPromotionRemoved')(event) ? promoteList(command) : []),
  ),
  E.right,
);
