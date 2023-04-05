import { DomainEvent, userDetailsUpdated } from '../../domain-events';
import { UpdateUserDetailsCommand } from '../commands/update-user-details';
import { UserResource } from '../resources/user-resource';

type ExecuteCommand = (command: UpdateUserDetailsCommand)
=> (userResource: UserResource)
=> ReadonlyArray<DomainEvent>;

export const executeCommand: ExecuteCommand = (command) => () => [
  userDetailsUpdated(command.id, command.avatarUrl, command.displayName),
];
