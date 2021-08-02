import { EventId, generate } from '../types/event-id';
import { GroupId } from '../types/group-id';
import { UserId } from '../types/user-id';

export type UserUnfollowedEditorialCommunityEvent = Readonly<{
  id: EventId,
  type: 'UserUnfollowedEditorialCommunity',
  date: Date,
  userId: UserId,
  editorialCommunityId: GroupId,
}>;

export const userUnfollowedEditorialCommunity = (
  userId: UserId,
  editorialCommunityId: GroupId,
): UserUnfollowedEditorialCommunityEvent => ({
  id: generate(),
  type: 'UserUnfollowedEditorialCommunity',
  date: new Date(),
  userId,
  editorialCommunityId,
});
