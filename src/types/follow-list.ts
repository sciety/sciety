import {
  userFollowedEditorialCommunity,
  UserFollowedEditorialCommunityEvent,
  userUnfollowedEditorialCommunity,
  UserUnfollowedEditorialCommunityEvent,
} from './domain-events';
import { GroupId } from './editorial-community-id';
import { UserId } from './user-id';

export class FollowList {
  private readonly userId: UserId;

  private items: Array<string>;

  constructor(userId: UserId, items: Array<string> = []) {
    this.userId = userId;
    this.items = items;
  }

  follow(editorialCommunityId: GroupId): ReadonlyArray<UserFollowedEditorialCommunityEvent> {
    if (this.items.includes(editorialCommunityId.value)) {
      return [];
    }

    this.items.push(editorialCommunityId.value);

    return [
      userFollowedEditorialCommunity(this.userId, editorialCommunityId),
    ];
  }

  unfollow(editorialCommunityId: GroupId): ReadonlyArray<UserUnfollowedEditorialCommunityEvent> {
    if (!this.items.includes(editorialCommunityId.value)) {
      return [];
    }

    this.items = this.items.filter((item) => item !== editorialCommunityId.value);

    return [
      userUnfollowedEditorialCommunity(this.userId, editorialCommunityId),
    ];
  }
}
