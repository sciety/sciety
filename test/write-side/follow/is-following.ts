import { pipe } from 'fp-ts/function';
import { constructEvent, userFollowedEditorialCommunity } from '../../../src/domain-events';
import { isFollowing } from '../../../src/write-side/follow/is-following';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

const groupId1 = arbitraryGroupId();
const userId1 = arbitraryUserId();
const userId2 = arbitraryUserId();

const unimportantEvents = [
  userFollowedEditorialCommunity(arbitraryUserId(), arbitraryGroupId()),
  userFollowedEditorialCommunity(userId2, groupId1),
  constructEvent('UserUnfollowedEditorialCommunity')({ userId: userId2, editorialCommunityId: groupId1 }),
];

describe('is-following', () => {
  describe('when the user is following the group', () => {
    const result = pipe(
      [
        ...unimportantEvents,
        userFollowedEditorialCommunity(userId1, groupId1),
        ...unimportantEvents,
      ],
      isFollowing(userId1, groupId1),
    );

    it('returns true', () => {
      expect(result).toBe(true);
    });
  });

  describe('when the user has unfollowed the group', () => {
    const result = pipe(
      [
        ...unimportantEvents,
        userFollowedEditorialCommunity(userId1, groupId1),
        ...unimportantEvents,
        constructEvent('UserUnfollowedEditorialCommunity')({ userId: userId1, editorialCommunityId: groupId1 }),
        ...unimportantEvents,
      ],
      isFollowing(userId1, groupId1),
    );

    it('ignores groups that the user has unfollowed', () => {
      expect(result).toBe(false);
    });
  });
});
