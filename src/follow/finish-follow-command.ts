import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { CommitEvents, followCommand, GetFollowList } from './follow-command';
import * as GroupId from '../types/group-id';
import { User } from '../types/user';

export const sessionGroupProperty = 'groupId';

type Ports = {
  commitEvents: CommitEvents,
  getFollowList: GetFollowList,
};

export const finishFollowCommand = (ports: Ports) => (g: string, user: User): TO.TaskOption<void> => pipe(
  g,
  GroupId.fromNullable,
  TO.fromOption,
  TO.chainTaskK((groupId) => followCommand(ports.getFollowList, ports.commitEvents)(user, groupId)),
);
