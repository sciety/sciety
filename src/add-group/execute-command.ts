import * as E from 'fp-ts/Either';
import {
  DomainEvent, RuntimeGeneratedEvent,
} from '../domain-events';

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

export const executeCommand: ExecuteCommand = () => () => E.right([]);
