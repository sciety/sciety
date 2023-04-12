import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { UpdateUserDetailsCommand } from '../../commands';
import { UserResource, replayUserResource } from './replay-user-resource';
import { ErrorMessage } from '../../../types/error-message';
import { DomainEvent, userDetailsUpdated } from '../../../domain-events';

type ExecuteCommand = (command: UpdateUserDetailsCommand)
=> (userResource: UserResource)
=> ReadonlyArray<DomainEvent>;

const executeCommand: ExecuteCommand = (command) => (userResource) => {
  const avatarUrl = (userResource.avatarUrl === command.avatarUrl) ? undefined : command.avatarUrl;
  const displayName = (userResource.displayName === command.displayName) ? undefined : command.displayName;
  return (avatarUrl === undefined && displayName === undefined)
    ? []
    : [userDetailsUpdated(command.userId, avatarUrl, displayName)];
};

type Update = (command: UpdateUserDetailsCommand)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<ErrorMessage, ReadonlyArray<DomainEvent>>;

export const update: Update = (command) => (events) => pipe(
  events,
  replayUserResource(command.userId),
  E.map(executeCommand(command)),
);
