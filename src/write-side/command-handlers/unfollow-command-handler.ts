import * as T from 'fp-ts/Task';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { isFollowing } from '../../http/form-submission-handlers/is-following.js';
import { constructEvent } from '../../domain-events/index.js';
import { GroupId } from '../../types/group-id.js';
import { UserId } from '../../types/user-id.js';
import { CommandHandler } from './command-handler.js';
import { DependenciesForCommands } from '../dependencies-for-commands.js';

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
