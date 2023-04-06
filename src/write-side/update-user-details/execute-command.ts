import { DomainEvent, userDetailsUpdated } from '../../domain-events';
import { UpdateUserDetailsCommand } from '../commands/update-user-details';
import { UserResource } from '../resources/user-resource';

type ExecuteCommand = (command: UpdateUserDetailsCommand)
=> (userResource: UserResource)
=> ReadonlyArray<DomainEvent>;

export const executeCommand: ExecuteCommand = (command) => (userResource) => {
  if (command.avatarUrl !== undefined) {
    if (command.avatarUrl !== userResource.avatarUrl) {
      return [userDetailsUpdated(command.id, command.avatarUrl)];
    }
  }
  return [];
};
