import * as O from 'fp-ts/Option';
import {
  evaluationRecorded,
  userFollowedEditorialCommunity, userSavedArticle,
  userUnfollowedEditorialCommunity,
} from '../../../src/domain-events';
import { updateGroupMeta } from '../../../src/shared-components/group-card/update-group-meta';
import { arbitraryDate } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('update-group-meta', () => {
  const groupId = arbitraryGroupId();
  const initial = { followerCount: 41, reviewCount: 27, latestActivity: O.some(new Date('1970')) };

  it('updates the meta when passed a UserFollowedEditorialCommunityEvent', () => {
    const event = userFollowedEditorialCommunity(arbitraryUserId(), groupId);
    const result = updateGroupMeta(groupId)(initial, event);

    expect(result).toStrictEqual({ ...initial, followerCount: 42 });
  });

  it('updates the meta when passed a UserUnfollowedEditorialCommunityEvent', () => {
    const event = userUnfollowedEditorialCommunity(arbitraryUserId(), groupId);
    const result = updateGroupMeta(groupId)(initial, event);

    expect(result).toStrictEqual({ ...initial, followerCount: 40 });
  });

  describe('when passed the first EvaluationRecorded', () => {
    const newerDate = new Date('2020');
    const event = evaluationRecorded(groupId, arbitraryDoi(), arbitraryReviewId(), arbitraryDate(), [], newerDate);
    const result = updateGroupMeta(groupId)({ ...initial, reviewCount: 0, latestActivity: O.none }, event);

    it('sets review count to 1', () => {
      expect(result.reviewCount).toBe(1);
    });

    it('sets the latest activity', () => {
      expect(result.latestActivity).toStrictEqual(O.some(newerDate));
    });
  });

  describe('when passed a newer EvaluationRecorded', () => {
    const newerDate = new Date('2020');
    const event = evaluationRecorded(groupId, arbitraryDoi(), arbitraryReviewId(), arbitraryDate(), [], newerDate);
    const result = updateGroupMeta(groupId)(initial, event);

    it('updates the review count', () => {
      expect(result.reviewCount).toBe(28);
    });

    it('updates the latest activity', () => {
      expect(result.latestActivity).toStrictEqual(O.some(newerDate));
    });
  });

  describe('when passed an older EvaluationRecorded', () => {
    const olderDate = new Date('1920');
    const event = evaluationRecorded(groupId, arbitraryDoi(), arbitraryReviewId(), arbitraryDate(), [], olderDate);
    const result = updateGroupMeta(groupId)(initial, event);

    it('updates the review count', () => {
      expect(result.reviewCount).toBe(28);
    });

    it('does not update the latest activity', () => {
      expect(result.latestActivity).toStrictEqual(initial.latestActivity);
    });
  });

  it('does not update the meta when passed any other domain event', () => {
    const event = userSavedArticle(arbitraryUserId(), arbitraryDoi());
    const result = updateGroupMeta(groupId)(initial, event);

    expect(result).toStrictEqual(initial);
  });
});
