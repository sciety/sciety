import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { CreateListCommand } from '../../commands/index.js';
import { constructEvent, DomainEvent, isEventOfType } from '../../../domain-events/index.js';
import { ResourceAction } from '../resource-action.js';

const getListIdsInUse = (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter(isEventOfType('ListCreated')),
  RA.map(({ listId }) => listId),
);

export const create: ResourceAction<CreateListCommand> = (command) => (events) => pipe(
  events,
  getListIdsInUse,
  (listIdsInUse) => (listIdsInUse.includes(command.listId)
    ? []
    : [constructEvent('ListCreated')(command)]),
  E.right,
);
