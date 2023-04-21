import * as O from 'fp-ts/Option';
import {
  evaluationRecorded,
  userFollowedEditorialCommunity, userSavedArticle,
  userUnfollowedEditorialCommunity,
} from '../../../src/domain-events';
import { updateGroupActivity } from '../../../src/shared-components/group-card/update-group-activity';
import { arbitraryDate } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('update-group-activity', () => {
  const groupId = arbitraryGroupId();
  const initial = { evaluationCount: 27, latestActivityAt: O.some(new Date('1970')) };

  it('updates the meta when passed a UserFollowedEditorialCommunityEvent', () => {
    const event = userFollowedEditorialCommunity(arbitraryUserId(), groupId);
    const result = updateGroupActivity(groupId)(initial, event);

    expect(result).toStrictEqual({ ...initial });
  });

  it('updates the meta when passed a UserUnfollowedEditorialCommunityEvent', () => {
    const event = userUnfollowedEditorialCommunity(arbitraryUserId(), groupId);
    const result = updateGroupActivity(groupId)(initial, event);

    expect(result).toStrictEqual({ ...initial });
  });

  describe('when passed the first EvaluationRecorded', () => {
    const newerDate = new Date('2020');
    const event = evaluationRecorded(
      groupId,
      arbitraryArticleId(),
      arbitraryReviewId(),
      [],
      newerDate,
      arbitraryDate(),
    );
    const result = updateGroupActivity(groupId)({ ...initial, evaluationCount: 0, latestActivityAt: O.none }, event);

    it('sets review count to 1', () => {
      expect(result.evaluationCount).toBe(1);
    });

    it('sets the latest activity', () => {
      expect(result.latestActivityAt).toStrictEqual(O.some(newerDate));
    });
  });

  describe('when passed a newer EvaluationRecorded', () => {
    const newerDate = new Date('2020');
    const event = evaluationRecorded(
      groupId,
      arbitraryArticleId(),
      arbitraryReviewId(),
      [],
      newerDate,
      arbitraryDate(),
    );
    const result = updateGroupActivity(groupId)(initial, event);

    it('updates the review count', () => {
      expect(result.evaluationCount).toBe(28);
    });

    it('updates the latest activity', () => {
      expect(result.latestActivityAt).toStrictEqual(O.some(newerDate));
    });
  });

  describe('when passed an older EvaluationRecorded', () => {
    const olderDate = new Date('1920');
    const event = evaluationRecorded(
      groupId,
      arbitraryArticleId(),
      arbitraryReviewId(),
      [],
      olderDate,
      arbitraryDate(),
    );
    const result = updateGroupActivity(groupId)(initial, event);

    it('updates the review count', () => {
      expect(result.evaluationCount).toBe(28);
    });

    it('does not update the latest activity', () => {
      expect(result.latestActivityAt).toStrictEqual(initial.latestActivityAt);
    });
  });

  it('does not update the meta when passed any other domain event', () => {
    const event = userSavedArticle(arbitraryUserId(), arbitraryArticleId());
    const result = updateGroupActivity(groupId)(initial, event);

    expect(result).toStrictEqual(initial);
  });
});
