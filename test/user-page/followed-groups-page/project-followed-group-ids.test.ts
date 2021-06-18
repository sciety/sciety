import * as T from 'fp-ts/Task';
import { userFollowedEditorialCommunity, userSavedArticle, userUnfollowedEditorialCommunity } from '../../../src/types/domain-events';
import { projectFollowedGroupIds } from '../../../src/user-page/followed-groups-page/project-followed-group-ids';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

const importantUser = arbitraryUserId();

describe('project-followed-group-ids', () => {
  describe('when a group is followed', () => {
    const group1 = arbitraryGroupId();
    const getAllEvents = T.of([
      userFollowedEditorialCommunity(importantUser, group1),
    ]);

    it('lists that group', async () => {
      const followed = await projectFollowedGroupIds(getAllEvents)(importantUser)();

      expect(followed).toStrictEqual([group1]);
    });
  });

  describe('when multiple groups are followed', () => {
    const group1 = arbitraryGroupId();
    const group2 = arbitraryGroupId();
    const group3 = arbitraryGroupId();
    const getAllEvents = T.of([
      userFollowedEditorialCommunity(importantUser, group1),
      userFollowedEditorialCommunity(importantUser, group2),
      userFollowedEditorialCommunity(importantUser, group3),
    ]);

    it('returns a list', async () => {
      const followed = await projectFollowedGroupIds(getAllEvents)(importantUser)();

      expect(followed).toStrictEqual([group1, group2, group3]);
    });
  });

  describe('when a group is unfollowed', () => {
    const group1 = arbitraryGroupId();
    const getAllEvents = T.of([
      userFollowedEditorialCommunity(importantUser, group1),
      userUnfollowedEditorialCommunity(importantUser, group1),
    ]);

    it('does not list that group', async () => {
      const followed = await projectFollowedGroupIds(getAllEvents)(importantUser)();

      expect(followed).toStrictEqual([]);
    });
  });

  describe('when a group is unfollowed and followed again', () => {
    const group1 = arbitraryGroupId();
    const getAllEvents = T.of([
      userFollowedEditorialCommunity(importantUser, group1),
      userUnfollowedEditorialCommunity(importantUser, group1),
      userFollowedEditorialCommunity(importantUser, group1),
    ]);

    it('lists that group', async () => {
      const followed = await projectFollowedGroupIds(getAllEvents)(importantUser)();

      expect(followed).toStrictEqual([group1]);
    });
  });

  describe('when a different user has followed a group', () => {
    const group1 = arbitraryGroupId();
    const getAllEvents = T.of([
      userFollowedEditorialCommunity(arbitraryUserId(), group1),
    ]);

    it('is ignored', async () => {
      const followed = await projectFollowedGroupIds(getAllEvents)(importantUser)();

      expect(followed).toStrictEqual([]);
    });
  });

  describe('when other events have occurred', () => {
    const group1 = arbitraryGroupId();

    it('they are ignored', async () => {
      const followed = await projectFollowedGroupIds(T.of([
        userFollowedEditorialCommunity(importantUser, group1),
        userSavedArticle(importantUser, arbitraryDoi()),
      ]))(importantUser)();

      expect(followed).toStrictEqual([group1]);
    });
  });
});
