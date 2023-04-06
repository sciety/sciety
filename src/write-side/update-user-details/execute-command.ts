import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { DomainEvent, userDetailsUpdated } from '../../domain-events';
import { UpdateUserDetailsCommand } from '../commands/update-user-details';
import { UserResource } from '../resources/user-resource';

type ExecuteCommand = (command: UpdateUserDetailsCommand)
=> (userResource: UserResource)
=> ReadonlyArray<DomainEvent>;

export const executeCommand: ExecuteCommand = (command) => (userResource) => pipe(
  command.avatarUrl,
  O.fromNullable,
  O.match(
    () => [],
    (avatarUrl) => ((userResource.avatarUrl === avatarUrl)
      ? []
      : [userDetailsUpdated(command.userId, O.some(avatarUrl), O.none)]),
  ),
);
