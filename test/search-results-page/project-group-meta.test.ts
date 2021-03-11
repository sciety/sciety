import { projectGroupMeta } from '../../src/search-results-page/project-group-meta';
import { Doi } from '../../src/types/doi';
import {
  editorialCommunityReviewedArticle,
  userFollowedEditorialCommunity,
  userUnfollowedEditorialCommunity,
} from '../../src/types/domain-events';
import { GroupId } from '../../src/types/group-id';
import { toUserId } from '../../src/types/user-id';

describe('project-group-meta', () => {
  describe('the follower count', () => {
    describe('with no events', () => {
      it('returns a zero count', () => {
        const { followerCount } = projectGroupMeta([])(new GroupId('123'));

        expect(followerCount).toBe(0);
      });
    });

    describe('with five events', () => {
      it('returns a count of 5', () => {
        const groupId = new GroupId('123');
        const events = [
          userFollowedEditorialCommunity(toUserId('1'), groupId),
          userFollowedEditorialCommunity(toUserId('2'), groupId),
          userFollowedEditorialCommunity(toUserId('3'), groupId),
          userFollowedEditorialCommunity(toUserId('4'), groupId),
          userFollowedEditorialCommunity(toUserId('5'), groupId),
        ];
        const { followerCount } = projectGroupMeta(events)(groupId);

        expect(followerCount).toBe(5);
      });
    });

    describe('with other groups follow events', () => {
      it('returns a count of 2', () => {
        const groupId = new GroupId('123');
        const otherGroupId = new GroupId('321');
        const events = [
          userFollowedEditorialCommunity(toUserId('1'), groupId),
          userFollowedEditorialCommunity(toUserId('2'), groupId),
          userFollowedEditorialCommunity(toUserId('3'), otherGroupId),
          userFollowedEditorialCommunity(toUserId('4'), otherGroupId),
          userFollowedEditorialCommunity(toUserId('5'), otherGroupId),
        ];
        const { followerCount } = projectGroupMeta(events)(groupId);

        expect(followerCount).toBe(2);
      });
    });

    describe('with follow and unfollow events', () => {
      it('returns the correct count', () => {
        const groupId = new GroupId('123');
        const events = [
          userFollowedEditorialCommunity(toUserId('1'), groupId),
          userFollowedEditorialCommunity(toUserId('2'), groupId),
          userFollowedEditorialCommunity(toUserId('3'), groupId),
          userUnfollowedEditorialCommunity(toUserId('1'), groupId),
          userUnfollowedEditorialCommunity(toUserId('3'), groupId),
        ];
        const { followerCount } = projectGroupMeta(events)(groupId);

        expect(followerCount).toBe(1);
      });
    });
  });

  describe('the review count', () => {
    describe('with no events', () => {
      it('returns a zero count', () => {
        const { reviewCount } = projectGroupMeta([])(new GroupId('123'));

        expect(reviewCount).toBe(0);
      });
    });

    describe('with five events', () => {
      it('returns a count of 5', () => {
        const groupId = new GroupId('123');
        const events = [
          editorialCommunityReviewedArticle(groupId, new Doi('10.1111/12345'), new Doi('10.1111/11111')),
          editorialCommunityReviewedArticle(groupId, new Doi('10.1111/12345'), new Doi('10.1111/22222')),
          editorialCommunityReviewedArticle(groupId, new Doi('10.1111/12345'), new Doi('10.1111/33333')),
          editorialCommunityReviewedArticle(groupId, new Doi('10.1111/12345'), new Doi('10.1111/44444')),
          editorialCommunityReviewedArticle(groupId, new Doi('10.1111/12345'), new Doi('10.1111/55555')),
        ];
        const { reviewCount } = projectGroupMeta(events)(groupId);

        expect(reviewCount).toBe(5);
      });
    });

    describe('with reviewd from different groups', () => {
      it('returns a count of the passed in group', () => {
        const groupId = new GroupId('123');
        const otherGroupId = new GroupId('321');
        const events = [
          editorialCommunityReviewedArticle(groupId, new Doi('10.1111/12345'), new Doi('10.1111/11111')),
          editorialCommunityReviewedArticle(groupId, new Doi('10.1111/12345'), new Doi('10.1111/22222')),
          editorialCommunityReviewedArticle(otherGroupId, new Doi('10.1111/12345'), new Doi('10.1111/33333')),
          editorialCommunityReviewedArticle(otherGroupId, new Doi('10.1111/12345'), new Doi('10.1111/44444')),
          editorialCommunityReviewedArticle(otherGroupId, new Doi('10.1111/12345'), new Doi('10.1111/55555')),
        ];
        const { reviewCount } = projectGroupMeta(events)(groupId);

        expect(reviewCount).toBe(2);
      });
    });
  });
});
