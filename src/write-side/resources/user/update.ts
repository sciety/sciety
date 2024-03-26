import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { UpdateUserDetailsCommand } from '../../commands';
import { UserResource, replayUserResource } from './replay-user-resource';
import { DomainEvent, constructEvent } from '../../../domain-events';
import { ResourceAction } from '../resource-action';

type ExecuteCommand = (command: UpdateUserDetailsCommand)
=> (userResource: UserResource)
=> ReadonlyArray<DomainEvent>;

const executeCommand: ExecuteCommand = (command) => (userResource) => {
  const displayName = (userResource.displayName === command.displayName) ? undefined : command.displayName;
  return (displayName === undefined)
    ? []
    : [constructEvent('UserDetailsUpdated')({
      userId: command.userId,
      avatarUrl: undefined,
      displayName,
    })];
};

export const update: ResourceAction<UpdateUserDetailsCommand> = (command) => (events) => pipe(
  events,
  replayUserResource(command.userId),
  E.map(executeCommand(command)),
);
