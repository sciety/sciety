import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { raiseEventsIfNecessary } from './raise-events-if-necessary';
import { DomainEvent } from '../domain-events';
import { RuntimeGeneratedEvent } from '../domain-events/runtime-generated-event';
import { GroupId } from '../types/group-id';

export type Command = {
  groupId: GroupId,
};

type ExecuteCommand = (command: Command)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<unknown, ReadonlyArray<RuntimeGeneratedEvent>>;

type ConfirmGroupExists = (groupId: GroupId)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<void, void>;

const confirmGroupExists: ConfirmGroupExists = () => () => E.right(undefined);

export const executeCommand: ExecuteCommand = (command) => (events) => pipe(
  events,
  E.right,
  E.chainFirst(confirmGroupExists(command.groupId)),
  E.map(raiseEventsIfNecessary(command)),
);
