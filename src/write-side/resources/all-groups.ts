import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { EventOfType, isEventOfType, DomainEvent } from '../../domain-events/index.js';
import { ErrorMessage, toErrorMessage } from '../../types/error-message.js';
import { AddGroupCommand } from '../commands/index.js';

type AllGroupsResource = ReadonlyArray<EventOfType<'GroupJoined'> | EventOfType<'GroupDetailsUpdated'>>;

export const replay = (events: ReadonlyArray<DomainEvent>): AllGroupsResource => pipe(
  events,
  RA.filter((event): event is EventOfType<'GroupJoined'> | EventOfType<'GroupDetailsUpdated'> => (
    isEventOfType('GroupJoined')(event)
    || isEventOfType('GroupDetailsUpdated')(event))),
);

export const check = (
  command: AddGroupCommand,
) => (
  resource: AllGroupsResource,
): E.Either<ErrorMessage, unknown> => pipe(
  resource,
  E.right,
  E.filterOrElse(
    RA.every((event) => event.slug !== command.slug),
    () => toErrorMessage(`Group with slug ${command.slug} already exists`),
  ),
  E.filterOrElse(
    RA.every((event) => event.name !== command.name),
    () => toErrorMessage(`Group with name ${command.name} already exists`),
  ),
  E.filterOrElse(
    RA.every((event) => event.groupId !== command.groupId),
    () => toErrorMessage(`Group with id ${command.groupId} already exists`),
  ),
  E.map(() => undefined),
);
