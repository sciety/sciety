import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../domain-events';
import { isFollowing } from '../../http/form-submission-handlers/is-following';
import { CommandHandler } from '../../types/command-handler';
import { UnfollowCommand } from '../commands/unfollow';
import { DependenciesForCommands } from '../dependencies-for-commands';
import { ResourceAction } from '../resources/resource-action';

type UnfollowCommandHandler = CommandHandler<UnfollowCommand>;

const unfollow: ResourceAction<UnfollowCommand> = (command) => (events) => pipe(
  events,
  isFollowing(command.userId, command.groupId),
  B.fold(
    () => [constructEvent('UserUnfollowedEditorialCommunity')({
      userId: command.userId,
      editorialCommunityId: command.groupId,
    })],
    () => [],
  ),
  E.right,
);

export const unfollowCommandHandler = (
  dependencies: DependenciesForCommands,
): UnfollowCommandHandler => (command) => pipe(
  dependencies.getAllEvents,
  T.map(unfollow(command)),
  TE.chain(dependencies.commitEvents),
);
