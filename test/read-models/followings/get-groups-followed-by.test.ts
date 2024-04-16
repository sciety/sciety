import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events';
import { getGroupsFollowedBy } from '../../../src/read-models/followings/get-groups-followed-by';
import { handleEvent, initialState } from '../../../src/read-models/followings/handle-event';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('get-group-ids-followed-by', () => {
  const userId = arbitraryUserId();

  describe('when multiple groups are followed', () => {
    const groupId1 = arbitraryGroupId();
    const groupId2 = arbitraryGroupId();
    const readmodel = pipe(
      [
        constructEvent('UserFollowedEditorialCommunity')({ userId, editorialCommunityId: groupId1 }),
        constructEvent('UserFollowedEditorialCommunity')({ userId, editorialCommunityId: groupId2 }),
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
        constructEvent('UserFollowedEditorialCommunity')({ userId, editorialCommunityId: groupId }),
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
        constructEvent('UserFollowedEditorialCommunity')({ userId, editorialCommunityId: groupId }),
        constructEvent('UserUnfollowedEditorialCommunity')({ userId, editorialCommunityId: groupId }),
        constructEvent('UserFollowedEditorialCommunity')({ userId, editorialCommunityId: groupId }),
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
        constructEvent('UserFollowedEditorialCommunity')({ userId: arbitraryUserId(), editorialCommunityId: groupId }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('that group is not returned', () => {
      expect(getGroupsFollowedBy(readmodel)(userId)).toStrictEqual([]);
    });
  });
});
