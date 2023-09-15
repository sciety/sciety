import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { isFollowing } from './is-following';
import { constructEvent } from '../../domain-events';
import { FollowCommand } from '../commands';
import { DependenciesForCommands } from '../dependencies-for-commands';
import { CommandHandler } from '../../types/command-handler';

type FollowCommandHandler = (
  dependencies: DependenciesForCommands
) => CommandHandler<FollowCommand>;

export const followCommandHandler: FollowCommandHandler = (
  dependencies,
) => (command) => pipe(
  dependencies.getAllEvents,
  T.map(isFollowing(command.userId, command.groupId)),
  T.map(B.fold(
    () => [constructEvent('UserFollowedEditorialCommunity')({
      userId: command.userId,
      editorialCommunityId: command.groupId,
    })],
    () => [],
  )),
  TE.rightTask,
  TE.chainTaskK(dependencies.commitEvents),
);
