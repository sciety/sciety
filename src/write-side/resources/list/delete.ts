import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import {
  DomainEvent, constructEvent, filterByName, isEventOfType,
} from '../../../domain-events';
import { toErrorMessage } from '../../../types/error-message';
import { ListId } from '../../../types/list-id';
import { DeleteListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

const doesListExist = (listId: ListId) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  filterByName(['ListCreated', 'ListDeleted']),
  RA.filter((event) => event.listId === listId),
  RA.last,
  O.filter(isEventOfType('ListCreated')),
  O.match(
    () => false,
    () => true,
  ),
);

export const deleteList: ResourceAction<DeleteListCommand> = (command) => (events) => pipe(
  events,
  doesListExist(command.listId),
  B.fold(
    () => E.left(toErrorMessage('not-found')),
    () => E.right([constructEvent('ListDeleted')(command)]),
  ),
);
