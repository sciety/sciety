import * as E from 'fp-ts/Either';
import {
  DomainEvent, groupJoined, RuntimeGeneratedEvent,
} from '../domain-events';
import * as GID from '../types/group-id';

export type Command = {
  name: string,
  shortDescription: string,
  homepage: string,
  avatarPath: string,
  descriptionPath: string,
  slug: string,
};

type ExecuteCommand = (command: Command, date?: Date)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<string, ReadonlyArray<RuntimeGeneratedEvent>>;

export const executeCommand: ExecuteCommand = (command, date = new Date()) => () => E.right([
  groupJoined({
    id: GID.generate(),
    ...command,
  }, date),
]);
