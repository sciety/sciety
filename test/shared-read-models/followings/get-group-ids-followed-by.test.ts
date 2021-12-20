import { userFollowedEditorialCommunity, userSavedArticle, userUnfollowedEditorialCommunity } from '../../../src/domain-events';
import { getGroupIdsFollowedBy } from '../../../src/shared-read-models/followings';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

const importantUser = arbitraryUserId();

describe('project-followed-group-ids', () => {
  describe('when a group is followed', () => {
    const group1 = arbitraryGroupId();
    const events = [
      userFollowedEditorialCommunity(importantUser, group1),
    ];
    const followed = getGroupIdsFollowedBy(importantUser)(events);

    it('lists that group', () => {
      expect(followed).toStrictEqual([group1]);
    });
  });

  describe('when multiple groups are followed', () => {
    const group1 = arbitraryGroupId();
    const group2 = arbitraryGroupId();
    const group3 = arbitraryGroupId();
    const events = [
      userFollowedEditorialCommunity(importantUser, group1),
      userFollowedEditorialCommunity(importantUser, group2),
      userFollowedEditorialCommunity(importantUser, group3),
    ];
    const followed = getGroupIdsFollowedBy(importantUser)(events);

    it('returns a list', () => {
      expect(followed).toStrictEqual([group1, group2, group3]);
    });
  });

  describe('when a group is unfollowed', () => {
    const group1 = arbitraryGroupId();
    const events = [
      userFollowedEditorialCommunity(importantUser, group1),
      userUnfollowedEditorialCommunity(importantUser, group1),
    ];
    const followed = getGroupIdsFollowedBy(importantUser)(events);

    it('does not list that group', () => {
      expect(followed).toStrictEqual([]);
    });
  });

  describe('when a group is unfollowed and followed again', () => {
    const group1 = arbitraryGroupId();
    const events = [
      userFollowedEditorialCommunity(importantUser, group1),
      userUnfollowedEditorialCommunity(importantUser, group1),
      userFollowedEditorialCommunity(importantUser, group1),
    ];
    const followed = getGroupIdsFollowedBy(importantUser)(events);

    it('lists that group', () => {
      expect(followed).toStrictEqual([group1]);
    });
  });

  describe('when a different user has followed a group', () => {
    const group1 = arbitraryGroupId();
    const events = [
      userFollowedEditorialCommunity(arbitraryUserId(), group1),
    ];
    const followed = getGroupIdsFollowedBy(importantUser)(events);

    it('is ignored', () => {
      expect(followed).toStrictEqual([]);
    });
  });

  describe('when other events have occurred', () => {
    const group1 = arbitraryGroupId();
    const followed = getGroupIdsFollowedBy(importantUser)([
      userFollowedEditorialCommunity(importantUser, group1),
      userSavedArticle(importantUser, arbitraryDoi()),
    ]);

    it('they are ignored', () => {
      expect(followed).toStrictEqual([group1]);
    });
  });
});
