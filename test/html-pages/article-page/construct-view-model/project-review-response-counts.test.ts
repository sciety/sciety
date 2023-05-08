import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import {
  userFoundReviewHelpful,
  userFoundReviewNotHelpful,
  userRevokedFindingReviewHelpful,
  userRevokedFindingReviewNotHelpful,
} from '../../../../src/domain-events';
import { projectReviewResponseCounts } from '../../../../src/html-pages/article-page/construct-view-model/project-review-response-counts';
import { TestFramework, createTestFramework } from '../../../framework';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { arbitraryUserId } from '../../../types/user-id.helper';

const reviewId = arbitraryEvaluationLocator();

describe('project-review-response-counts', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('given no events', () => {
    let projected: { helpfulCount: number, notHelpfulCount: number };

    beforeEach(async () => {
      projected = await pipe(
        framework.getAllEvents,
        T.map(projectReviewResponseCounts(reviewId)),
      )();
    });

    it('returns 0 `helpful` and 0 `not helpful`', () => {
      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });

  describe('given a user responded to a different review', () => {
    it('returns 0 `helpful` and 0 `not helpful`', () => {
      const differentReviewId = arbitraryEvaluationLocator();
      const projected = projectReviewResponseCounts(reviewId)([
        userFoundReviewHelpful(arbitraryUserId(), differentReviewId),
      ]);

      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });

  describe('given N different users responded helpful events', () => {
    it('returns N `helpful` and 0 `not helpful`', () => {
      const projected = projectReviewResponseCounts(reviewId)([
        userFoundReviewHelpful(arbitraryUserId(), reviewId),
        userFoundReviewHelpful(arbitraryUserId(), reviewId),
        userFoundReviewHelpful(arbitraryUserId(), reviewId),
      ]);

      expect(projected).toStrictEqual({ helpfulCount: 3, notHelpfulCount: 0 });
    });
  });

  describe('given a single user responded helpful and revoked the helpful response', () => {
    it('returns 0 `helpful` and 0 `not helpful`', () => {
      const userId = arbitraryUserId();
      const projected = projectReviewResponseCounts(reviewId)([
        userFoundReviewHelpful(userId, reviewId),
        userRevokedFindingReviewHelpful(userId, reviewId),
      ]);

      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });

  describe('given N different users responded not helpful events', () => {
    it('returns 0 `helpful` and N `not helpful`', () => {
      const projected = projectReviewResponseCounts(reviewId)([
        userFoundReviewNotHelpful(arbitraryUserId(), reviewId),
        userFoundReviewNotHelpful(arbitraryUserId(), reviewId),
        userFoundReviewNotHelpful(arbitraryUserId(), reviewId),
      ]);

      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 3 });
    });
  });

  describe('given a single user responded: helpful, revoke helpful, not helpful, revoke not helpful', () => {
    it('returns 0 `helpful` and 0 `not helpful`', () => {
      const userId = arbitraryUserId();
      const projected = projectReviewResponseCounts(reviewId)([
        userFoundReviewHelpful(userId, reviewId),
        userRevokedFindingReviewHelpful(userId, reviewId),
        userFoundReviewNotHelpful(userId, reviewId),
        userRevokedFindingReviewNotHelpful(userId, reviewId),
      ]);

      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });
});
