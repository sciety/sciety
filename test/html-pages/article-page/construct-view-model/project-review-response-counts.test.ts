import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import { projectReviewResponseCounts } from '../../../../src/html-pages/article-page/construct-view-model/project-review-response-counts';
import { ResponseCounts } from '../../../../src/html-pages/article-page/view-model';
import { TestFramework, createTestFramework } from '../../../framework';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { arbitraryUserId } from '../../../types/user-id.helper';

describe('project-review-response-counts', () => {
  const evaluationLocator = arbitraryEvaluationLocator();
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('given no events', () => {
    let projected: ResponseCounts;

    beforeEach(async () => {
      projected = await pipe(
        framework.getAllEvents,
        T.map(projectReviewResponseCounts(evaluationLocator)),
      )();
    });

    it('returns 0 `helpful` and 0 `not helpful`', () => {
      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });

  describe('given a user responded to a different evaluation', () => {
    let projected: ResponseCounts;

    beforeEach(async () => {
      await framework.commandHelpers.respond('respond-helpful', arbitraryEvaluationLocator(), arbitraryUserId());
      projected = await pipe(
        framework.getAllEvents,
        T.map(projectReviewResponseCounts(evaluationLocator)),
      )();
    });

    it('returns 0 `helpful` and 0 `not helpful`', () => {
      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });

  describe('given N different users responded helpful events', () => {
    let projected: ResponseCounts;

    beforeEach(async () => {
      await framework.commandHelpers.respond('respond-helpful', evaluationLocator, arbitraryUserId());
      await framework.commandHelpers.respond('respond-helpful', evaluationLocator, arbitraryUserId());
      await framework.commandHelpers.respond('respond-helpful', evaluationLocator, arbitraryUserId());
      projected = await pipe(
        framework.getAllEvents,
        T.map(projectReviewResponseCounts(evaluationLocator)),
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
      await framework.commandHelpers.respond('respond-helpful', evaluationLocator, userId);
      await framework.commandHelpers.respond('revoke-response', evaluationLocator, userId);
      projected = await pipe(
        framework.getAllEvents,
        T.map(projectReviewResponseCounts(evaluationLocator)),
      )();
    });

    it('returns 0 `helpful` and 0 `not helpful`', () => {
      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });

  describe('given N different users responded not helpful events', () => {
    let projected: ResponseCounts;

    beforeEach(async () => {
      await framework.commandHelpers.respond('respond-not-helpful', evaluationLocator, arbitraryUserId());
      await framework.commandHelpers.respond('respond-not-helpful', evaluationLocator, arbitraryUserId());
      await framework.commandHelpers.respond('respond-not-helpful', evaluationLocator, arbitraryUserId());
      projected = await pipe(
        framework.getAllEvents,
        T.map(projectReviewResponseCounts(evaluationLocator)),
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
      await framework.commandHelpers.respond('respond-helpful', evaluationLocator, userId);
      await framework.commandHelpers.respond('revoke-response', evaluationLocator, userId);
      await framework.commandHelpers.respond('respond-not-helpful', evaluationLocator, userId);
      await framework.commandHelpers.respond('revoke-response', evaluationLocator, userId);
      projected = await pipe(
        framework.getAllEvents,
        T.map(projectReviewResponseCounts(evaluationLocator)),
      )();
    });

    it('returns 0 `helpful` and 0 `not helpful`', () => {
      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });
});
