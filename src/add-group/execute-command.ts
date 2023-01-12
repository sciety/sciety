import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { AddGroupCommand } from '../commands';
import {
  DomainEvent, groupJoined, GroupJoinedEvent, isGroupJoinedEvent,
} from '../domain-events';

type AllGroupsResource = ReadonlyArray<GroupJoinedEvent>;

const replayAllGroupsResource = (events: ReadonlyArray<DomainEvent>): AllGroupsResource => pipe(
  events,
  RA.filter(isGroupJoinedEvent),
);

const check = (command: AddGroupCommand) => (resource: AllGroupsResource): E.Either<string, unknown> => pipe(
  resource,
  RA.filter((event) => command.slug === event.slug),
  RA.match(
    () => E.right(undefined),
    () => E.left(`Group with slug ${command.slug} already exists`),
  ),
);

type ExecuteCommand = (command: AddGroupCommand)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<string, ReadonlyArray<DomainEvent>>;

export const executeCommand: ExecuteCommand = (command) => (events) => pipe(
  replayAllGroupsResource(events),
  check(command),
  E.map(() => [groupJoined(command)]),
);
