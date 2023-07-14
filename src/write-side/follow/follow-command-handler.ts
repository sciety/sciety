import * as T from 'fp-ts/Task';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { isFollowing } from './is-following';
import { constructEvent } from '../../domain-events';
import { CommandResult } from '../../types/command-result';
import { FollowCommand } from '../commands';
import { DependenciesForCommands } from '../dependencies-for-commands';

export const followCommandHandler = (
  dependencies: DependenciesForCommands,
) => (command: FollowCommand): T.Task<CommandResult> => pipe(
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
