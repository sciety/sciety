import * as E from 'fp-ts/Either';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { doesListExist } from './does-list-exist';
import { getListIdsThatHaveEverBeenUsed } from './get-list-ids-that-have-ever-been-used';
import { DomainEvent, constructEvent } from '../../../domain-events';
import { toErrorMessage } from '../../../types/error-message';
import { DeleteListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

const attemptToDeleteList = (events: ReadonlyArray<DomainEvent>, command: DeleteListCommand) => pipe(
  events,
  doesListExist(command.listId),
  B.fold(
    () => [],
    () => [constructEvent('ListDeleted')(command)],
  ),
  E.right,
);

// eslint-disable-next-line @typescript-eslint/naming-convention
export const delete_: ResourceAction<DeleteListCommand> = (command) => (events) => pipe(
  events,
  getListIdsThatHaveEverBeenUsed,
  (allocatedListIds) => (allocatedListIds.includes(command.listId)
    ? attemptToDeleteList(events, command)
    : E.left(toErrorMessage('not-found'))
  ),
);
