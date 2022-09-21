import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import {
  DomainEvent, groupJoined, RuntimeGeneratedEvent,
} from '../domain-events';
import { getGroupBySlug } from '../shared-read-models/groups/get-group-by-slug';
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
  getGroupBySlug(command.slug),
  E.swap,
  E.bimap(
    () => `Group with slug ${command.slug} already exists`,
    () => [
      groupJoined({
        id: GID.generate(),
        ...command,
      }, date),
    ],
  ),
);
