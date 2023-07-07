import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { replayAllLists } from './all-lists';
import { CreateListCommand } from '../../commands';
import { constructEvent } from '../../../domain-events';
import { ResourceAction } from '../resource-action';

export const create: ResourceAction<CreateListCommand> = (command) => (events) => pipe(
  events,
  replayAllLists,
  (resource) => (resource.includes(command.listId)
    ? []
    : [constructEvent('ListCreated')(command)]),
  E.right,
);
