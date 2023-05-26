import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent, userFollowedEditorialCommunity } from '../../../src/domain-events';
import { handleEvent, initialState } from '../../../src/shared-read-models/followings';
import { getGroupsFollowedBy } from '../../../src/shared-read-models/followings/get-groups-followed-by';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('get-group-ids-followed-by', () => {
  const userId = arbitraryUserId();

  describe('when multiple groups are followed', () => {
    const groupId1 = arbitraryGroupId();
    const groupId2 = arbitraryGroupId();
    const readmodel = pipe(
      [
        userFollowedEditorialCommunity(userId, groupId1),
        userFollowedEditorialCommunity(userId, groupId2),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns all groups in unspecified order', () => {
      expect(getGroupsFollowedBy(readmodel)(userId)).toStrictEqual([groupId1, groupId2]);
    });
  });

  describe('when a group is unfollowed', () => {
    const groupId = arbitraryGroupId();
    const readmodel = pipe(
      [
        userFollowedEditorialCommunity(userId, groupId),
        constructEvent('UserUnfollowedEditorialCommunity')({ userId, editorialCommunityId: groupId }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('does not list that group', () => {
      expect(getGroupsFollowedBy(readmodel)(userId)).toStrictEqual([]);
    });
  });

  describe('when a group is unfollowed and followed again', () => {
    const groupId = arbitraryGroupId();
    const readmodel = pipe(
      [
        userFollowedEditorialCommunity(userId, groupId),
        constructEvent('UserUnfollowedEditorialCommunity')({ userId, editorialCommunityId: groupId }),
        userFollowedEditorialCommunity(userId, groupId),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('lists that group', () => {
      expect(getGroupsFollowedBy(readmodel)(userId)).toStrictEqual([groupId]);
    });
  });

  describe('when a different user has followed a group', () => {
    const groupId = arbitraryGroupId();
    const readmodel = pipe(
      [
        userFollowedEditorialCommunity(arbitraryUserId(), groupId),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('that group is not returned', () => {
      expect(getGroupsFollowedBy(readmodel)(userId)).toStrictEqual([]);
    });
  });
});
