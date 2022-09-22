import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  DomainEvent, groupJoined, isGroupJoinedEvent, RuntimeGeneratedEvent,
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

export const executeCommand: ExecuteCommand = (command, date = new Date()) => (events) => pipe(
  events,
  RA.filter(isGroupJoinedEvent),
  RA.filter((event) => event.slug === command.slug),
  RA.match(
    () => E.right([
      groupJoined({
        id: GID.generate(),
        ...command,
      }, date),
    ]),
    () => E.left(`Group with slug ${command.slug} already exists`),
  ),
);
