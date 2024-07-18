import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { doesListExist } from './does-list-exist';
import { getListIdsThatHaveEverBeenUsed } from './get-list-ids-that-have-ever-been-used';
import { constructEvent, DomainEvent } from '../../../domain-events';
import { toErrorMessage } from '../../../types/error-message';
import { CreateListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

const attemptToCreateList = (command: CreateListCommand, events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  getListIdsThatHaveEverBeenUsed,
  (unavailableListIds) => (unavailableListIds.includes(command.listId)
    ? E.left(toErrorMessage('list-id-has-already-been-used'))
    : E.right([constructEvent('ListCreated')(command)])),
);

export const create: ResourceAction<CreateListCommand> = (command) => (events) => (doesListExist(command.listId)(events)
  ? E.right([])
  : attemptToCreateList(command, events));
