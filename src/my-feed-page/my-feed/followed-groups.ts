import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';
import { followedGroupIds } from '../../user-page/follow-list/project-followed-group-ids';

type FollowedGroups = (userId: UserId) => (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<GroupId>;

export const followedGroups: FollowedGroups = (userId) => (events) => pipe(
  events,
  followedGroupIds(userId),
);
