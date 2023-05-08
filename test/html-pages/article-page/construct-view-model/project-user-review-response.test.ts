import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import {
  userFoundReviewHelpful,
  userFoundReviewNotHelpful,
  userRevokedFindingReviewHelpful,
  userRevokedFindingReviewNotHelpful,
} from '../../../../src/domain-events';
import { projectUserReviewResponse } from '../../../../src/html-pages/article-page/construct-view-model/project-user-review-response';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { arbitraryUserId } from '../../../types/user-id.helper';
import { TestFramework, createTestFramework } from '../../../framework';

describe('project-user-review-response', () => {
  let userResponse: ReturnType<ReturnType<typeof projectUserReviewResponse>>;
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('no response events', () => {
    beforeEach(async () => {
      userResponse = await pipe(
        framework.getAllEvents,
        T.map(projectUserReviewResponse(arbitraryEvaluationLocator(), O.some(arbitraryUserId()))),
      )();
    });

    it('returns nothing', () => {
      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one helpful response event', () => {
    it('returns `helpful`', () => {
      const userId = arbitraryUserId();
      const reviewId = arbitraryEvaluationLocator();
      userResponse = pipe(
        [
          userFoundReviewHelpful(userId, reviewId),
        ],
        projectUserReviewResponse(reviewId, O.some(userId)),
      );

      expect(userResponse).toStrictEqual(O.some('helpful'));
    });
  });

  describe('one helpful response event from another user', () => {
    it('returns nothing', () => {
      const reviewId = arbitraryEvaluationLocator();
      userResponse = pipe(
        [
          userFoundReviewHelpful(arbitraryUserId(), reviewId),
        ],
        projectUserReviewResponse(reviewId, O.some(arbitraryUserId())),
      );

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one helpful response event for another review from the same user', () => {
    it('returns nothing', () => {
      const userId = arbitraryUserId();
      userResponse = pipe(
        [
          userFoundReviewHelpful(userId, arbitraryEvaluationLocator()),
        ],
        projectUserReviewResponse(arbitraryEvaluationLocator(), O.some(userId)),
      );

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('there is no user', () => {
    it('return nothing', () => {
      const reviewId = arbitraryEvaluationLocator();
      userResponse = pipe(
        [
          userFoundReviewHelpful(arbitraryUserId(), reviewId),
        ],
        projectUserReviewResponse(reviewId, O.none),
      );

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one revoked helpful response', () => {
    it('returns no-response', () => {
      const userId = arbitraryUserId();
      const reviewId = arbitraryEvaluationLocator();
      userResponse = pipe(
        [
          userFoundReviewHelpful(userId, reviewId),
          userRevokedFindingReviewHelpful(userId, reviewId),
        ],
        projectUserReviewResponse(arbitraryEvaluationLocator(), O.some(userId)),
      );

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one revoked helpful response on a different review', () => {
    it('doesn\'t change the state of the current review', () => {
      const userId = arbitraryUserId();
      const reviewId = arbitraryEvaluationLocator();
      const otherReviewId = arbitraryEvaluationLocator();
      userResponse = pipe(
        [
          userFoundReviewHelpful(userId, reviewId),
          userFoundReviewHelpful(userId, otherReviewId),
          userRevokedFindingReviewHelpful(userId, otherReviewId),
        ],
        projectUserReviewResponse(reviewId, O.some(userId)),
      );

      expect(userResponse).toStrictEqual(O.some('helpful'));
    });
  });

  describe('one not helpful response event', () => {
    it('returns `not helpful`', () => {
      const userId = arbitraryUserId();
      const reviewId = arbitraryEvaluationLocator();
      userResponse = pipe(
        [
          userFoundReviewNotHelpful(userId, reviewId),
        ],
        projectUserReviewResponse(reviewId, O.some(userId)),
      );

      expect(userResponse).toStrictEqual(O.some('not-helpful'));
    });
  });

  describe('one revoked not-helpful response', () => {
    it('returns nothing', async () => {
      const userId = arbitraryUserId();
      const reviewId = arbitraryEvaluationLocator();
      userResponse = pipe(
        [
          userFoundReviewNotHelpful(userId, reviewId),
          userRevokedFindingReviewNotHelpful(userId, reviewId),
        ],
        projectUserReviewResponse(reviewId, O.some(userId)),
      );

      expect(userResponse).toStrictEqual(O.none);
    });
  });
});
