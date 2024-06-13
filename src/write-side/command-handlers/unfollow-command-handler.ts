import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CommandHandler } from '../../types/command-handler';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';
import { DependenciesForCommands } from '../dependencies-for-commands';
import { unfollow } from '../resources/group-follow';

export type UnfollowCommand = {
  userId: UserId,
  groupId: GroupId,
};

type UnfollowCommandHandler = CommandHandler<UnfollowCommand>;

/**
 * @deprecated should be substituted with executeResourceAction
 */
export const unfollowCommandHandler = (
  dependencies: DependenciesForCommands,
): UnfollowCommandHandler => (command) => pipe(
  dependencies.getAllEvents,
  T.map(unfollow(command)),
  TE.chain(dependencies.commitEvents),
);
