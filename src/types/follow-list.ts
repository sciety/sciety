import EditorialCommunityId from './editorial-community-id';

export default class FollowList {
  private items: Array<EditorialCommunityId>;

  constructor(items: Array<EditorialCommunityId>) {
    this.items = items;
  }

  follow(editorialCommunityId: EditorialCommunityId): void {
    this.items.push(editorialCommunityId);
  }

  unfollow(editorialCommunityId: EditorialCommunityId): void {
    this.items = this.items.filter((item) => item.value !== editorialCommunityId.value);
  }
}
