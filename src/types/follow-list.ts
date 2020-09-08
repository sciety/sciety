import { UserFollowedEditorialCommunityEvent, UserUnfollowedEditorialCommunityEvent } from './domain-events';
import EditorialCommunityId from './editorial-community-id';
import { generate } from './event-id';
import { UserId } from './user-id';

export default class FollowList {
  private readonly userId: UserId;

  private items: Array<EditorialCommunityId>;

  constructor(userId: UserId, items: Array<EditorialCommunityId>) {
    this.userId = userId;
    this.items = items;
  }

  follow(editorialCommunityId: EditorialCommunityId): ReadonlyArray<UserFollowedEditorialCommunityEvent> {
    this.items.push(editorialCommunityId);

    return [
      {
        id: generate(),
        type: 'UserFollowedEditorialCommunity',
        date: new Date(),
        userId: this.userId,
        editorialCommunityId,
      },
    ];
  }

  unfollow(editorialCommunityId: EditorialCommunityId): ReadonlyArray<UserUnfollowedEditorialCommunityEvent> {
    this.items = this.items.filter((item) => item.value !== editorialCommunityId.value);

    return [
      {
        id: generate(),
        type: 'UserUnfollowedEditorialCommunity',
        date: new Date(),
        userId: this.userId,
        editorialCommunityId,
      },
    ];
  }
}
