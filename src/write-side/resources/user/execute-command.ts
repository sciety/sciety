import { DomainEvent, userDetailsUpdated } from '../../../domain-events';
import { UpdateUserDetailsCommand } from '../../commands/update-user-details';
import { UserResource } from './replay-user-resource';

type ExecuteCommand = (command: UpdateUserDetailsCommand)
=> (userResource: UserResource)
=> ReadonlyArray<DomainEvent>;

export const executeCommand: ExecuteCommand = (command) => (userResource) => {
  const avatarUrl = (userResource.avatarUrl === command.avatarUrl) ? undefined : command.avatarUrl;
  const displayName = (userResource.displayName === command.displayName) ? undefined : command.displayName;
  return (avatarUrl === undefined && displayName === undefined)
    ? []
    : [userDetailsUpdated(command.userId, avatarUrl, displayName)];
};
