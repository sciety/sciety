import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { ResourceAction } from '../resources/resource-action.js';
import { isFollowing } from '../../http/form-submission-handlers/is-following.js';
import { constructEvent } from '../../domain-events/index.js';
import { FollowCommand } from '../commands/index.js';
import { DependenciesForCommands } from '../dependencies-for-commands.js';
import { CommandHandler } from '../../types/command-handler.js';

type FollowCommandHandler = (
  dependencies: DependenciesForCommands
) => CommandHandler<FollowCommand>;

const follow: ResourceAction<FollowCommand> = (command) => (events) => pipe(
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
