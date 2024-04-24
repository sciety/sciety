import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import {
  DomainEvent, EventOfType, constructEvent, isEventOfType,
} from '../../../domain-events';
import { PromoteListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

const promotionAlreadyExists = (
  command: PromoteListCommand,
) => (event: EventOfType<'ListPromotionCreated'>) => event.listId === command.listId && event.byGroup === command.forGroup;

const hasGroupAlreadyPromotedSameList = (command: PromoteListCommand) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter(isEventOfType('ListPromotionCreated')),
  RA.some(promotionAlreadyExists(command)),
);

export const create: ResourceAction<PromoteListCommand> = (command) => (events) => pipe(
  events,
  hasGroupAlreadyPromotedSameList(command),
  B.fold(
    () => [constructEvent('ListPromotionCreated')({
      listId: command.listId,
      byGroup: command.forGroup,
    })],
    () => [],
  ),
  E.right,
);
