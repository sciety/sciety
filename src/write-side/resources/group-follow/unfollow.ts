import * as E from 'fp-ts/Either';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../domain-events';
import { isFollowing } from '../../../http/form-submission-handlers/is-following';
import { GroupId } from '../../../types/group-id';
import { UserId } from '../../../types/user-id';
import { ResourceAction } from '../resource-action';

type UnfollowCommand = {
  userId: UserId,
  groupId: GroupId,
};

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
