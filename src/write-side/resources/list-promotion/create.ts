import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, constructEvent, isEventOfType } from '../../../domain-events';
import { PromoteListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

const foo = (command: PromoteListCommand) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter(isEventOfType('ListPromotionCreated')),
  RA.filter((event) => event.listId === command.listId && event.byGroup === command.forGroup),
);

export const create: ResourceAction<PromoteListCommand> = (command) => (events) => pipe(
  events,
  foo(command),
  (arrayOfEvents) => {
    if (arrayOfEvents.length === 0) {
      return [constructEvent('ListPromotionCreated')({
        listId: command.listId,
        byGroup: command.forGroup,
      })];
    }
    return [];
  },
  E.right,
);
