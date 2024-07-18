import * as E from 'fp-ts/Either';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { doesListExist } from './does-list-exist';
import { getListIdsThatHaveEverBeenUsed } from './get-list-ids-that-have-ever-been-used';
import { DomainEvent, constructEvent } from '../../../domain-events';
import { toErrorMessage } from '../../../types/error-message';
import { DeleteListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

const foo = (events: ReadonlyArray<DomainEvent>, command: DeleteListCommand) => pipe(
  events,
  getListIdsThatHaveEverBeenUsed,
  (listIdsInUse) => (listIdsInUse.includes(command.listId)
    ? E.right([])
    : E.left(toErrorMessage('not-found'))
  ),
);

export const deleteList: ResourceAction<DeleteListCommand> = (command) => (events) => pipe(
  events,
  doesListExist(command.listId),
  B.fold(
    () => foo(events, command),
    () => E.right([constructEvent('ListDeleted')(command)]),
  ),
);
