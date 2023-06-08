import { pipe } from 'fp-ts/function';
import { replayAllLists } from '../resources/all-lists';
import { CreateListCommand } from '../commands';
import {
  constructEvent, DomainEvent, EventOfType,
} from '../../domain-events';

type ExecuteCreateListCommand = (command: CreateListCommand)
=> (events: ReadonlyArray<DomainEvent>)
=> ReadonlyArray<EventOfType<'ListCreated'>>;

export const executeCreateListCommand: ExecuteCreateListCommand = (command) => (events) => pipe(
  events,
  replayAllLists,
  (resource) => (resource.includes(command.listId)
    ? []
    : [constructEvent('ListCreated')({
      listId: command.listId,
      name: command.name,
      description: command.description,
      ownerId: command.ownerId,
    })]),
);
