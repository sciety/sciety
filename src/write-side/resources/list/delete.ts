import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { getListIdsInUse } from './get-list-ids-in-use';
import { constructEvent } from '../../../domain-events';
import { toErrorMessage } from '../../../types/error-message';
import { DeleteListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

export const deleteList: ResourceAction<DeleteListCommand> = (command) => (events) => pipe(
  events,
  getListIdsInUse,
  (listIdsInUse) => (listIdsInUse.includes(command.listId)
    ? E.right([constructEvent('ListDeleted')(command)])
    : E.left(toErrorMessage('not-found'))),
);
