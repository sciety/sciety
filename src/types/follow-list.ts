import EditorialCommunityId from './editorial-community-id';

export default class FollowList {
  private items: Array<EditorialCommunityId>;

  changed: boolean;

  constructor(items: Array<EditorialCommunityId>) {
    this.items = items;
    this.changed = false;
  }

  follow(editorialCommunityId: EditorialCommunityId): void {
    this.items.push(editorialCommunityId);
    this.changed = true;
  }

  follows(editorialCommunityId: EditorialCommunityId): boolean {
    return this.items.some((item) => item.value === editorialCommunityId.value);
  }

  unfollow(editorialCommunityId: EditorialCommunityId): void {
    this.items = this.items.filter((item) => item.value !== editorialCommunityId.value);
    this.changed = true;
  }

  getContents(): Array<EditorialCommunityId> {
    return this.items;
  }
}
