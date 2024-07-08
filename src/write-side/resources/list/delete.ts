import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent, filterByName, isEventOfType } from '../../../domain-events';
import { toErrorMessage } from '../../../types/error-message';
import { DeleteListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

export const deleteList: ResourceAction<DeleteListCommand> = (command) => (events) => pipe(
  events,
  filterByName(['ListCreated', 'ListDeleted']),
  RA.filter((event) => event.listId === command.listId),
  RA.last,
  O.filter(isEventOfType('ListCreated')),
  O.match(
    () => E.left(toErrorMessage('not-found')),
    () => E.right([constructEvent('ListDeleted')(command)]),
  ),
);
