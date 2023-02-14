import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { followCommand, Ports } from './follow-command';
import { CommandResult } from '../../types/command-result';
import * as GroupId from '../../types/group-id';
import { User } from '../../types/user';

export { Ports } from './follow-command';

export const sessionGroupProperty = 'groupId';

export const finishFollowCommand = (ports: Ports) => (g: string, user: User): TO.TaskOption<CommandResult> => pipe(
  g,
  GroupId.fromNullable,
  TO.fromOption,
  TO.chainTaskK((groupId) => followCommand(ports)(user.id, groupId)),
);
