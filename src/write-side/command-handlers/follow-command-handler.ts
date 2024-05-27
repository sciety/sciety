import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../domain-events';
import { isFollowing } from '../../http/form-submission-handlers/is-following';
import { CommandHandler } from '../../types/command-handler';
import { FollowCommand } from '../commands';
import { DependenciesForCommands } from '../dependencies-for-commands';
import { ResourceAction } from '../resources/resource-action';

type FollowCommandHandler = (
  dependencies: DependenciesForCommands
) => CommandHandler<FollowCommand>;

export const follow: ResourceAction<FollowCommand> = (command) => (events) => pipe(
  events,
  isFollowing(command.userId, command.groupId),
  B.fold(
    () => [constructEvent('UserFollowedEditorialCommunity')({
      userId: command.userId,
      editorialCommunityId: command.groupId,
    })],
    () => [],
  ),
  E.right,
);

export const followCommandHandler: FollowCommandHandler = (
  dependencies,
) => (command) => pipe(
  dependencies.getAllEvents,
  T.map(follow(command)),
  TE.chainW(dependencies.commitEvents),
);
