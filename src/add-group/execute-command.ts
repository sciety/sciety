import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as LID from '../types/list-id';
import * as LOID from '../types/list-owner-id';
import { AddGroupCommand } from '../commands';
import {
  DomainEvent, evaluatedArticlesListSpecified, groupJoined, GroupJoinedEvent, isGroupJoinedEvent, listCreated,
} from '../domain-events';

type AllGroupsResource = ReadonlyArray<GroupJoinedEvent>;

const replayAllGroupsResource = (events: ReadonlyArray<DomainEvent>): AllGroupsResource => pipe(
  events,
  RA.filter(isGroupJoinedEvent),
);

const check = (command: AddGroupCommand) => (resource: AllGroupsResource): E.Either<string, unknown> => pipe(
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

type ExecuteCommand = (command: AddGroupCommand)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<string, ReadonlyArray<DomainEvent>>;

export const executeCommand: ExecuteCommand = (command) => (events) => pipe(
  replayAllGroupsResource(events),
  check(command),
  E.map(LID.generate),
  E.map((listId) => [
    groupJoined({
      id: command.groupId,
      name: command.name,
      avatarPath: command.avatarPath,
      descriptionPath: command.descriptionPath,
      shortDescription: command.shortDescription,
      homepage: command.homepage,
      slug: command.slug,
    }),
    listCreated(
      listId,
      'Evaluated articles',
      `Articles that have been evaluated by ${command.name}`,
      LOID.fromGroupId(command.groupId),
    ),
    evaluatedArticlesListSpecified(listId, command.groupId),
  ]),
);
