import { projectReviewResponseCounts } from '../../src/article-page/project-review-response-counts';
import {
  userFoundReviewHelpful,
  userFoundReviewNotHelpful,
  userRevokedFindingReviewHelpful,
  userRevokedFindingReviewNotHelpful,
} from '../../src/types/domain-events';
import { toUserId } from '../../src/types/user-id';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('project-review-response-counts', () => {
  describe('given no events', () => {
    it('returns 0 `helpful` and 0 `not helpful`', async () => {
      const reviewId = arbitraryReviewId();

      const projected = await projectReviewResponseCounts(reviewId)(async () => [])();

      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });

  describe('given a user responded to a different review', () => {
    it('returns 0 `helpful` and 0 `not helpful`', async () => {
      const reviewId = arbitraryReviewId();
      const differentReviewId = arbitraryReviewId();

      const projected = await projectReviewResponseCounts(reviewId)(async () => [
        userFoundReviewHelpful(toUserId('some-user'), differentReviewId),
      ])();

      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });

  describe('given N different users responded helpful events', () => {
    it('returns N `helpful` and 0 `not helpful`', async () => {
      const reviewId = arbitraryReviewId();
      const userA = toUserId('A');
      const userB = toUserId('B');
      const userC = toUserId('C');

      const projected = await projectReviewResponseCounts(reviewId)(async () => [
        userFoundReviewHelpful(userA, reviewId),
        userFoundReviewHelpful(userB, reviewId),
        userFoundReviewHelpful(userC, reviewId),
      ])();

      expect(projected).toStrictEqual({ helpfulCount: 3, notHelpfulCount: 0 });
    });
  });

  describe('given a single user responded helpful and revoked the helpful response', () => {
    it('returns 0 `helpful` and 0 `not helpful`', async () => {
      const reviewId = arbitraryReviewId();
      const userId = toUserId('some-user');

      const projected = await projectReviewResponseCounts(reviewId)(async () => [
        userFoundReviewHelpful(userId, reviewId),
        userRevokedFindingReviewHelpful(userId, reviewId),
      ])();

      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });

  describe('given N different users responded not helpful events', () => {
    it('returns 0 `helpful` and N `not helpful`', async () => {
      const reviewId = arbitraryReviewId();
      const userA = toUserId('A');
      const userB = toUserId('B');
      const userC = toUserId('C');

      const projected = await projectReviewResponseCounts(reviewId)(async () => [
        userFoundReviewNotHelpful(userA, reviewId),
        userFoundReviewNotHelpful(userB, reviewId),
        userFoundReviewNotHelpful(userC, reviewId),
      ])();

      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 3 });
    });
  });

  describe('given a single user responded: helpful, revoke helpful, not helpful, revoke not helpful', () => {
    it('returns 0 `helpful` and 0 `not helpful`', async () => {
      const reviewId = arbitraryReviewId();
      const userId = toUserId('A');

      const projected = await projectReviewResponseCounts(reviewId)(async () => [
        userFoundReviewHelpful(userId, reviewId),
        userRevokedFindingReviewHelpful(userId, reviewId),
        userFoundReviewNotHelpful(userId, reviewId),
        userRevokedFindingReviewNotHelpful(userId, reviewId),
      ])();

      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });
});
