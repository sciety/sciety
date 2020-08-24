import { UserFollowedEditorialCommunityEvent, UserUnfollowedEditorialCommunityEvent } from './domain-events';
import EditorialCommunityId from './editorial-community-id';
import { UserId } from './user-id';

export default class FollowList {
  private readonly userId: UserId;

  private items: Array<EditorialCommunityId>;

  constructor(userId: UserId, items: Array<EditorialCommunityId>) {
    this.userId = userId;
    this.items = items;
  }

  follow(editorialCommunityId: EditorialCommunityId): UserFollowedEditorialCommunityEvent {
    this.items.push(editorialCommunityId);

    return {
      type: 'UserFollowedEditorialCommunity',
      date: new Date(),
      userId: this.userId,
      editorialCommunityId,
    };
  }

  unfollow(editorialCommunityId: EditorialCommunityId): UserUnfollowedEditorialCommunityEvent {
    this.items = this.items.filter((item) => item.value !== editorialCommunityId.value);

    return {
      type: 'UserUnfollowedEditorialCommunity',
      date: new Date(),
      userId: this.userId,
      editorialCommunityId,
    };
  }
}
