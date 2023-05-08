import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import { projectReviewResponseCounts } from '../../../../src/html-pages/article-page/construct-view-model/project-review-response-counts';
import { ResponseCounts } from '../../../../src/html-pages/article-page/view-model';
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
    let projected: ResponseCounts;

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
    let projected: ResponseCounts;

    beforeEach(async () => {
      await framework.commandHelpers.respond('respond-helpful', arbitraryEvaluationLocator(), arbitraryUserId());
      projected = await pipe(
        framework.getAllEvents,
        T.map(projectReviewResponseCounts(reviewId)),
      )();
    });

    it('returns 0 `helpful` and 0 `not helpful`', () => {
      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });

  describe('given N different users responded helpful events', () => {
    let projected: ResponseCounts;

    beforeEach(async () => {
      await framework.commandHelpers.respond('respond-helpful', reviewId, arbitraryUserId());
      await framework.commandHelpers.respond('respond-helpful', reviewId, arbitraryUserId());
      await framework.commandHelpers.respond('respond-helpful', reviewId, arbitraryUserId());
      projected = await pipe(
        framework.getAllEvents,
        T.map(projectReviewResponseCounts(reviewId)),
      )();
    });

    it('returns N `helpful` and 0 `not helpful`', () => {
      expect(projected).toStrictEqual({ helpfulCount: 3, notHelpfulCount: 0 });
    });
  });

  describe('given a single user responded helpful and revoked the helpful response', () => {
    const userId = arbitraryUserId();
    let projected: ResponseCounts;

    beforeEach(async () => {
      await framework.commandHelpers.respond('respond-helpful', reviewId, userId);
      await framework.commandHelpers.respond('revoke-response', reviewId, userId);
      projected = await pipe(
        framework.getAllEvents,
        T.map(projectReviewResponseCounts(reviewId)),
      )();
    });

    it('returns 0 `helpful` and 0 `not helpful`', () => {
      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });

  describe('given N different users responded not helpful events', () => {
    let projected: ResponseCounts;

    beforeEach(async () => {
      await framework.commandHelpers.respond('respond-not-helpful', reviewId, arbitraryUserId());
      await framework.commandHelpers.respond('respond-not-helpful', reviewId, arbitraryUserId());
      await framework.commandHelpers.respond('respond-not-helpful', reviewId, arbitraryUserId());
      projected = await pipe(
        framework.getAllEvents,
        T.map(projectReviewResponseCounts(reviewId)),
      )();
    });

    it('returns 0 `helpful` and N `not helpful`', () => {
      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 3 });
    });
  });

  describe('given a single user responded: helpful, revoke helpful, not helpful, revoke not helpful', () => {
    const userId = arbitraryUserId();
    let projected: ResponseCounts;

    beforeEach(async () => {
      await framework.commandHelpers.respond('respond-helpful', reviewId, userId);
      await framework.commandHelpers.respond('revoke-response', reviewId, userId);
      await framework.commandHelpers.respond('respond-not-helpful', reviewId, userId);
      await framework.commandHelpers.respond('revoke-response', reviewId, userId);
      projected = await pipe(
        framework.getAllEvents,
        T.map(projectReviewResponseCounts(reviewId)),
      )();
    });

    it('returns 0 `helpful` and 0 `not helpful`', () => {
      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });
});
