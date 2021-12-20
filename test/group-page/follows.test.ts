import * as T from 'fp-ts/Task';
import { userFollowedEditorialCommunity, userUnfollowedEditorialCommunity } from '../../src/domain-events';
import { follows } from '../../src/group-page/follows';
import { groupIdFromString } from '../types/group-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('follows', () => {
  const someone = arbitraryUserId();
  const group1 = groupIdFromString('group-1');
  const group2 = groupIdFromString('group-2');

  describe('when there are no events', () => {
    const getAllEvents = T.of([]);

    it('is not following the group', async () => {
      const result = await follows(getAllEvents)(someone, groupIdFromString('group-1'))();

      expect(result).toBe(false);
    });
  });

  describe('when there is one follow event', () => {
    const getAllEvents = T.of([
      userFollowedEditorialCommunity(someone, group1),
    ]);

    it('is following the group', async () => {
      const result = await follows(getAllEvents)(someone, groupIdFromString('group-1'))();

      expect(result).toBe(true);
    });
  });

  describe('when there is a follow event followed by unfollow event', () => {
    const getAllEvents = T.of([
      userFollowedEditorialCommunity(someone, group1),
      userUnfollowedEditorialCommunity(someone, group1),
    ]);

    it('not following the group', async () => {
      const result = await follows(getAllEvents)(someone, groupIdFromString('group-1'))();

      expect(result).toBe(false);
    });
  });

  describe('when another user has a follow event', () => {
    const someoneElse = arbitraryUserId();
    const getAllEvents = T.of([
      userFollowedEditorialCommunity(someoneElse, group1),
    ]);

    it('not following the group', async () => {
      const result = await follows(getAllEvents)(someone, groupIdFromString('group-1'))();

      expect(result).toBe(false);
    });
  });

  describe('when a second group has both follow and unfollow events and the first has only follow event', () => {
    const getAllEvents = T.of([
      userFollowedEditorialCommunity(someone, group2),
      userFollowedEditorialCommunity(someone, group1),
      userUnfollowedEditorialCommunity(someone, group2),
    ]);

    it('is following the group', async () => {
      const result = await follows(getAllEvents)(someone, groupIdFromString('group-1'))();

      expect(result).toBe(true);
    });
  });
});
