import * as E from 'fp-ts/Either';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../domain-events';
import { isFollowing } from '../../http/form-submission-handlers/is-following';
import { FollowCommand } from '../commands';
import { ResourceAction } from '../resources/resource-action';

/**
 * @deprecated should be substituted with executeResourceAction
 */
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
