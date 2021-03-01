import { projectReviewResponseCounts } from '../../src/article-page/project-review-response-counts';
import { Doi } from '../../src/types/doi';
import {
  userFoundReviewHelpful,
  userFoundReviewNotHelpful,
  userRevokedFindingReviewHelpful,
  userRevokedFindingReviewNotHelpful,
} from '../../src/types/domain-events';
import { toUserId } from '../../src/types/user-id';

describe('project-review-response-counts', () => {
  describe('given no events', () => {
    it('returns 0 `helpful` and 0 `not helpful`', async () => {
      const reviewId = new Doi('10.1234/5678');

      const projected = await projectReviewResponseCounts(async () => [])(reviewId)();

      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });

  describe('given a user responded to a different review', () => {
    it('returns 0 `helpful` and 0 `not helpful`', async () => {
      const reviewId = new Doi('10.1234/5678');
      const differentReviewId = new Doi('10.9999/9999');

      const project = projectReviewResponseCounts(async () => [
        userFoundReviewHelpful(toUserId('some-user'), differentReviewId),
      ]);
      const projected = await project(reviewId)();

      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });

  describe('given N different users responded helpful events', () => {
    it('returns N `helpful` and 0 `not helpful`', async () => {
      const reviewId = new Doi('10.1234/5678');
      const userA = toUserId('A');
      const userB = toUserId('B');
      const userC = toUserId('C');

      const project = projectReviewResponseCounts(async () => [
        userFoundReviewHelpful(userA, reviewId),
        userFoundReviewHelpful(userB, reviewId),
        userFoundReviewHelpful(userC, reviewId),
      ]);
      const projected = await project(reviewId)();

      expect(projected).toStrictEqual({ helpfulCount: 3, notHelpfulCount: 0 });
    });
  });

  describe('given a single user responded helpful and revoked the helpful response', () => {
    it('returns 0 `helpful` and 0 `not helpful`', async () => {
      const reviewId = new Doi('10.1234/5678');
      const userId = toUserId('some-user');

      const project = projectReviewResponseCounts(async () => [
        userFoundReviewHelpful(userId, reviewId),
        userRevokedFindingReviewHelpful(userId, reviewId),
      ]);
      const projected = await project(reviewId)();

      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });

  describe('given N different users responded not helpful events', () => {
    it('returns 0 `helpful` and N `not helpful`', async () => {
      const reviewId = new Doi('10.1234/5678');
      const userA = toUserId('A');
      const userB = toUserId('B');
      const userC = toUserId('C');

      const project = projectReviewResponseCounts(async () => [
        userFoundReviewNotHelpful(userA, reviewId),
        userFoundReviewNotHelpful(userB, reviewId),
        userFoundReviewNotHelpful(userC, reviewId),
      ]);
      const projected = await project(reviewId)();

      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 3 });
    });
  });

  describe('given a single user responded: helpful, revoke helpful, not helpful, revoke not helpful', () => {
    it('returns 0 `helpful` and 0 `not helpful`', async () => {
      const reviewId = new Doi('10.1234/5678');
      const userId = toUserId('A');

      const project = projectReviewResponseCounts(async () => [
        userFoundReviewHelpful(userId, reviewId),
        userRevokedFindingReviewHelpful(userId, reviewId),
        userFoundReviewNotHelpful(userId, reviewId),
        userRevokedFindingReviewNotHelpful(userId, reviewId),
      ]);
      const projected = await project(reviewId)();

      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });
});
