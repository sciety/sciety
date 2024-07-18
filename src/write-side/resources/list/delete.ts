import * as E from 'fp-ts/Either';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { doesListExist } from './does-list-exist';
import { constructEvent } from '../../../domain-events';
import { toErrorMessage } from '../../../types/error-message';
import { DeleteListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

export const deleteList: ResourceAction<DeleteListCommand> = (command) => (events) => pipe(
  events,
  doesListExist(command.listId),
  B.fold(
    () => E.left(toErrorMessage('not-found')),
    () => E.right([constructEvent('ListDeleted')(command)]),
  ),
);
