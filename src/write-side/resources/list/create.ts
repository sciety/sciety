import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent, DomainEvent, isEventOfType } from '../../../domain-events';
import { CreateListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

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
