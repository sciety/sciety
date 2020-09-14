import { UserFollowedEditorialCommunityEvent, UserUnfollowedEditorialCommunityEvent } from './domain-events';
import EditorialCommunityId from './editorial-community-id';
import { generate } from './event-id';
import { UserId } from './user-id';

export default class FollowList {
  private readonly userId: UserId;

  private items: Array<string>;

  constructor(userId: UserId, items: Array<string> = []) {
    this.userId = userId;
    this.items = items;
  }

  follow(editorialCommunityId: EditorialCommunityId): ReadonlyArray<UserFollowedEditorialCommunityEvent> {
    if (this.items.includes(editorialCommunityId.value)) {
      return [];
    }

    this.items.push(editorialCommunityId.value);

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
    if (!this.items.includes(editorialCommunityId.value)) {
      return [];
    }

    this.items = this.items.filter((item) => item !== editorialCommunityId.value);

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
