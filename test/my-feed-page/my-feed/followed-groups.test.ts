import { userFollowedEditorialCommunity, userUnfollowedEditorialCommunity } from '../../../src/domain-events';
import { followedGroups } from '../../../src/my-feed-page/my-feed/followed-groups';
import { arbitraryGroupId, groupIdFromString } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('followed-groups', () => {
  const userId = arbitraryUserId();

  describe('there are no follow events', () => {
    it('returns an empty array', () => {
      const groupIds = followedGroups([])(userId);

      expect(groupIds).toStrictEqual([]);
    });
  });

  describe('there is a single follow event for the user', () => {
    it('returns the group id', () => {
      const groupId = arbitraryGroupId();
      const events = [userFollowedEditorialCommunity(userId, groupId)];
      const groupIds = followedGroups(events)(userId);

      expect(groupIds).toStrictEqual([groupId]);
    });
  });

  describe('there is a single follow event and a single unfollow event for the user', () => {
    it('returns an empty array', () => {
      const groupId = groupIdFromString('group');
      const sameGroupId = groupIdFromString('group');
      const events = [
        userFollowedEditorialCommunity(userId, groupId),
        userUnfollowedEditorialCommunity(userId, sameGroupId),
      ];
      const groupIds = followedGroups(events)(userId);

      expect(groupIds).toStrictEqual([]);
    });
  });

  describe('there are 2 follow events for different groups for the user', () => {
    it('returns the group ids', () => {
      const groupId1 = arbitraryGroupId();
      const groupId2 = arbitraryGroupId();
      const events = [
        userFollowedEditorialCommunity(userId, groupId1),
        userFollowedEditorialCommunity(userId, groupId2),
      ];
      const groupIds = followedGroups(events)(userId);

      expect(groupIds).toStrictEqual([groupId1, groupId2]);
    });
  });

  describe('there are 2 follow events and 1 unfollow events for the user', () => {
    it('returns the group ids of the still followed group', () => {
      const groupId1 = arbitraryGroupId();
      const groupId2 = arbitraryGroupId();
      const events = [
        userFollowedEditorialCommunity(userId, groupId1),
        userFollowedEditorialCommunity(userId, groupId2),
        userUnfollowedEditorialCommunity(userId, groupId1),
      ];
      const groupIds = followedGroups(events)(userId);

      expect(groupIds).toStrictEqual([groupId2]);
    });
  });

  describe('there is only a follow event for another user', () => {
    it('returns an empty array', () => {
      const groupId = arbitraryGroupId();
      const events = [
        userFollowedEditorialCommunity(arbitraryUserId(), groupId),
      ];
      const groupIds = followedGroups(events)(userId);

      expect(groupIds).toStrictEqual([]);
    });
  });

  describe('there is a single follow event for the user, and a follow and unfollow event for another user', () => {
    it('returns an empty array', () => {
      const groupId = arbitraryGroupId();
      const otherUserId = arbitraryUserId();
      const events = [
        userFollowedEditorialCommunity(userId, groupId),
        userFollowedEditorialCommunity(otherUserId, groupId),
        userUnfollowedEditorialCommunity(otherUserId, groupId),
      ];
      const groupIds = followedGroups(events)(userId);

      expect(groupIds).toStrictEqual([groupId]);
    });
  });
});
