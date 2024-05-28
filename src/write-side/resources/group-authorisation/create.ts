import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent, isEventOfType } from '../../../domain-events';
import { AssignUserAsGroupAdminCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

export const create: ResourceAction<AssignUserAsGroupAdminCommand> = (command) => (events) => pipe(
  events,
  RA.filter(isEventOfType('UserAssignedAsAdminOfGroup')),
  RA.filter((event) => event.userId === command.userId && event.groupId === command.groupId),
  RA.match(
    () => [constructEvent('UserAssignedAsAdminOfGroup')(command)],
    () => [],
  ),
  E.right,
);
