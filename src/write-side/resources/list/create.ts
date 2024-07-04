import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { getListIdsInUse } from './get-list-ids-in-use';
import { constructEvent } from '../../../domain-events';
import { CreateListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

export const create: ResourceAction<CreateListCommand> = (command) => (events) => pipe(
  events,
  getListIdsInUse,
  (listIdsInUse) => (listIdsInUse.includes(command.listId)
    ? []
    : [constructEvent('ListCreated')(command)]),
  E.right,
);
