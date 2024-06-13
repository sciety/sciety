import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../domain-events';
import { isFollowing } from '../../http/form-submission-handlers/is-following';
import { CommandHandler } from '../../types/command-handler';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';
import { DependenciesForCommands } from '../dependencies-for-commands';
import { ResourceAction } from '../resources/resource-action';

export type UnfollowCommand = {
  userId: UserId,
  groupId: GroupId,
};

type UnfollowCommandHandler = CommandHandler<UnfollowCommand>;

const unfollow: ResourceAction<UnfollowCommand> = (command) => (events) => pipe(
  events,
  isFollowing(command.userId, command.groupId),
  B.fold(
    () => [],
    () => [constructEvent('UserUnfollowedEditorialCommunity')({
      userId: command.userId,
      editorialCommunityId: command.groupId,
    })],
  ),
  E.right,
);
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
