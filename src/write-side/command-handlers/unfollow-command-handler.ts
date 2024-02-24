import * as T from 'fp-ts/Task';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { isFollowing } from '../../http/form-submission-handlers/is-following';
import { constructEvent } from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';
import { CommandHandler } from './command-handler';
import { DependenciesForCommands } from '../dependencies-for-commands';

type UnfollowCommand = {
  userId: UserId,
  groupId: GroupId,
};

type UnfollowCommandHandler = CommandHandler<UnfollowCommand>;

export const unfollowCommandHandler = (
  dependencies: DependenciesForCommands,
): UnfollowCommandHandler => (command) => pipe(
  dependencies.getAllEvents,
  T.map(isFollowing(command.userId, command.groupId)),
  T.map(B.fold(
    () => [],
    () => [constructEvent('UserUnfollowedEditorialCommunity')({
      userId: command.userId,
      editorialCommunityId: command.groupId,
    })],
  )),
  T.chain(dependencies.commitEvents),
);
