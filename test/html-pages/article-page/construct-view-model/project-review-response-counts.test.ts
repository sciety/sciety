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
  let result: ResponseCounts;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('given no events', () => {
    beforeEach(async () => {
      result = await pipe(
        framework.getAllEvents,
        T.map(projectReviewResponseCounts(evaluationLocator)),
      )();
    });

    it('returns 0 `helpful` and 0 `not helpful`', () => {
      expect(result).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });

  describe('given a user responded to a different evaluation', () => {
    beforeEach(async () => {
      await framework.commandHelpers.respond('respond-helpful', arbitraryEvaluationLocator(), arbitraryUserId());
      result = await pipe(
        framework.getAllEvents,
        T.map(projectReviewResponseCounts(evaluationLocator)),
      )();
    });

    it('returns 0 `helpful` and 0 `not helpful`', () => {
      expect(result).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });

  describe('given N different users responded helpful events', () => {
    beforeEach(async () => {
      await framework.commandHelpers.respond('respond-helpful', evaluationLocator, arbitraryUserId());
      await framework.commandHelpers.respond('respond-helpful', evaluationLocator, arbitraryUserId());
      await framework.commandHelpers.respond('respond-helpful', evaluationLocator, arbitraryUserId());
      result = await pipe(
        framework.getAllEvents,
        T.map(projectReviewResponseCounts(evaluationLocator)),
      )();
    });

    it('returns N `helpful` and 0 `not helpful`', () => {
      expect(result).toStrictEqual({ helpfulCount: 3, notHelpfulCount: 0 });
    });
  });

  describe('given a single user responded helpful and revoked the helpful response', () => {
    const userId = arbitraryUserId();

    beforeEach(async () => {
      await framework.commandHelpers.respond('respond-helpful', evaluationLocator, userId);
      await framework.commandHelpers.respond('revoke-response', evaluationLocator, userId);
      result = await pipe(
        framework.getAllEvents,
        T.map(projectReviewResponseCounts(evaluationLocator)),
      )();
    });

    it('returns 0 `helpful` and 0 `not helpful`', () => {
      expect(result).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });

  describe('given N different users responded not helpful events', () => {
    beforeEach(async () => {
      await framework.commandHelpers.respond('respond-not-helpful', evaluationLocator, arbitraryUserId());
      await framework.commandHelpers.respond('respond-not-helpful', evaluationLocator, arbitraryUserId());
      await framework.commandHelpers.respond('respond-not-helpful', evaluationLocator, arbitraryUserId());
      result = await pipe(
        framework.getAllEvents,
        T.map(projectReviewResponseCounts(evaluationLocator)),
      )();
    });

    it('returns 0 `helpful` and N `not helpful`', () => {
      expect(result).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 3 });
    });
  });

  describe('given a single user responded: helpful, revoke helpful, not helpful, revoke not helpful', () => {
    const userId = arbitraryUserId();

    beforeEach(async () => {
      await framework.commandHelpers.respond('respond-helpful', evaluationLocator, userId);
      await framework.commandHelpers.respond('revoke-response', evaluationLocator, userId);
      await framework.commandHelpers.respond('respond-not-helpful', evaluationLocator, userId);
      await framework.commandHelpers.respond('revoke-response', evaluationLocator, userId);
      result = await pipe(
        framework.getAllEvents,
        T.map(projectReviewResponseCounts(evaluationLocator)),
      )();
    });

    it('returns 0 `helpful` and 0 `not helpful`', () => {
      expect(result).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });
});
