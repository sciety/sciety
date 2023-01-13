import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { AddGroupCommand } from '../commands';
import {
  DomainEvent, GroupJoinedEvent, isGroupJoinedEvent,
} from '../../domain-events';

type AllGroupsResource = ReadonlyArray<GroupJoinedEvent>;

export const replay = (events: ReadonlyArray<DomainEvent>): AllGroupsResource => pipe(
  events,
  RA.filter(isGroupJoinedEvent),
);

export const check = (command: AddGroupCommand) => (resource: AllGroupsResource): E.Either<string, unknown> => pipe(
  resource,
  E.right,
  E.filterOrElse(
    RA.every((event) => event.slug !== command.slug),
    () => `Group with slug ${command.slug} already exists`,
  ),
  E.filterOrElse(
    RA.every((event) => event.groupId !== command.groupId),
    () => `Group with id ${command.groupId} already exists`,
  ),
  E.map(() => undefined),
);
