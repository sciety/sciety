import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Eq as stringEq } from 'fp-ts/string';
import { AddGroupCommand } from '../commands';
import {
  DomainEvent, groupJoined, GroupJoinedEvent, isGroupJoinedEvent, RuntimeGeneratedEvent,
} from '../domain-events';
import * as GID from '../types/group-id';

const isSlugEqualIn = (
  command: AddGroupCommand,
) => (
  event: GroupJoinedEvent,
) => stringEq.equals(command.slug, event.slug);

type ExecuteCommand = (command: AddGroupCommand)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<string, ReadonlyArray<RuntimeGeneratedEvent>>;

export const executeCommand: ExecuteCommand = (command) => (events) => pipe(
  events,
  RA.filter(isGroupJoinedEvent),
  RA.filter(isSlugEqualIn(command)),
  RA.match(
    () => E.right([
      groupJoined({
        id: GID.generate(),
        ...command,
      }),
    ]),
    () => E.left(`Group with slug ${command.slug} already exists`),
  ),
);
