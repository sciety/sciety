import * as T from 'fp-ts/Task';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { isFollowing } from './is-following';
import { constructEvent } from '../../domain-events';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { CommandResult } from '../../types/command-result';
import { FollowCommand } from '../commands';

export type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

export const followCommandHandler = (dependencies: Ports) => (command: FollowCommand): T.Task<CommandResult> => pipe(
  dependencies.getAllEvents,
  T.map(isFollowing(command.userId, command.groupId)),
  T.map(B.fold(
    () => [constructEvent('UserFollowedEditorialCommunity')({
      userId: command.userId,
      editorialCommunityId: command.groupId,
    })],
    () => [],
  )),
  T.chain(dependencies.commitEvents),
);
