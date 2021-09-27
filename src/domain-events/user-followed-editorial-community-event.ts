import { EventId, generate } from '../types/event-id';
import { GroupId } from '../types/group-id';
import { UserId } from '../types/user-id';

export type UserFollowedEditorialCommunityEvent = Readonly<{
  id: EventId,
  type: 'UserFollowedEditorialCommunity',
  date: Date,
  userId: UserId,
  editorialCommunityId: GroupId,
}>;

export const userFollowedEditorialCommunity = (
  userId: UserId,
  editorialCommunityId: GroupId,
  date: Date = new Date(),
): UserFollowedEditorialCommunityEvent => ({
  id: generate(),
  type: 'UserFollowedEditorialCommunity',
  date,
  userId,
  editorialCommunityId,
});
