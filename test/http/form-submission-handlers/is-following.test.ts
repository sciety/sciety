import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events/index.js';
import { isFollowing } from '../../../src/http/form-submission-handlers/is-following.js';
import { arbitraryGroupId } from '../../types/group-id.helper.js';
import { arbitraryUserId } from '../../types/user-id.helper.js';

const groupId1 = arbitraryGroupId();
const userId1 = arbitraryUserId();
const userId2 = arbitraryUserId();

const unimportantEvents = [
  constructEvent('UserFollowedEditorialCommunity')({ userId: arbitraryUserId(), editorialCommunityId: arbitraryGroupId() }),
  constructEvent('UserFollowedEditorialCommunity')({ userId: userId2, editorialCommunityId: groupId1 }),
  constructEvent('UserUnfollowedEditorialCommunity')({ userId: userId2, editorialCommunityId: groupId1 }),
];

describe('is-following', () => {
  describe('when the user is following the group', () => {
    const result = pipe(
      [
        ...unimportantEvents,
        constructEvent('UserFollowedEditorialCommunity')({ userId: userId1, editorialCommunityId: groupId1 }),
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
        constructEvent('UserFollowedEditorialCommunity')({ userId: userId1, editorialCommunityId: groupId1 }),
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
