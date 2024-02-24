import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { UpdateUserDetailsCommand } from '../../commands/index.js';
import { UserResource, replayUserResource } from './replay-user-resource.js';
import { DomainEvent, constructEvent } from '../../../domain-events/index.js';
import { ResourceAction } from '../resource-action.js';

type ExecuteCommand = (command: UpdateUserDetailsCommand)
=> (userResource: UserResource)
=> ReadonlyArray<DomainEvent>;

const executeCommand: ExecuteCommand = (command) => (userResource) => {
  const avatarUrl = (userResource.avatarUrl === command.avatarUrl) ? undefined : command.avatarUrl;
  const displayName = (userResource.displayName === command.displayName) ? undefined : command.displayName;
  return (avatarUrl === undefined && displayName === undefined)
    ? []
    : [constructEvent('UserDetailsUpdated')({
      userId: command.userId,
      avatarUrl,
      displayName,
    })];
};

export const update: ResourceAction<UpdateUserDetailsCommand> = (command) => (events) => pipe(
  events,
  replayUserResource(command.userId),
  E.map(executeCommand(command)),
);
