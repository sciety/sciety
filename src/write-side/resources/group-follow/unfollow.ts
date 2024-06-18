import * as E from 'fp-ts/Either';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../domain-events';
import { isFollowing } from '../../../http/form-submission-handlers/is-following';
import { UnfollowCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

export const unfollow: ResourceAction<UnfollowCommand> = (command) => (events) => pipe(
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
