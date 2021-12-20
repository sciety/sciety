import { FollowList } from '../../src/follow/follow-list';
import { groupIdFromString } from '../types/group-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('follow-list', () => {
  const userId1 = arbitraryUserId();
  const id = 'id1';
  const group1Id = groupIdFromString(id);

  describe('follow', () => {
    describe('when the group to be followed is not currently followed', () => {
      it('follows the group', () => {
        const list = new FollowList(userId1);

        const events = list.follow(group1Id);

        expect(events).toHaveLength(1);
        expect(events[0].editorialCommunityId).toBe(group1Id);
      });
    });

    describe('when the group to be followed is already followed', () => {
      it('leaves the list unchanged', () => {
        const list = new FollowList(userId1);

        list.follow(group1Id);
        const events = list.follow(groupIdFromString(id));

        expect(events).toHaveLength(0);
      });
    });
  });

  describe('unfollow', () => {
    describe('when the group to be unfollowed is currently followed', () => {
      it('unfollows the group', async () => {
        const list = new FollowList(userId1);
        list.follow(group1Id);

        const events = list.unfollow(group1Id);

        expect(events).toHaveLength(1);
        expect(events[0].editorialCommunityId).toBe(group1Id);
      });
    });

    describe('when the group to be unfollowed is not already followed', () => {
      it('does nothing', async () => {
        const list = new FollowList(userId1);

        const events = list.unfollow(group1Id);

        expect(events).toHaveLength(0);
      });
    });

    describe('when the group to be unfollowed has already been unfollowed', () => {
      it('does nothing', async () => {
        const list = new FollowList(userId1);
        list.follow(group1Id);
        list.unfollow(group1Id);

        const events = list.unfollow(group1Id);

        expect(events).toHaveLength(0);
      });
    });
  });
});
