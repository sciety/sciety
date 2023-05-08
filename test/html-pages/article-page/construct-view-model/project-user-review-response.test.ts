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
import { UserId } from '../../../../src/types/user-id';

describe('project-user-review-response', () => {
  const evaluationLocator = arbitraryEvaluationLocator();
  const userId = arbitraryUserId();
  let userResponse: ReturnType<ReturnType<typeof projectUserReviewResponse>>;
  let framework: TestFramework;

  const calculateUserResponse = async (u: O.Option<UserId>) => pipe(
    framework.getAllEvents,
    T.map(projectUserReviewResponse(evaluationLocator, u)),
  )();

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('no response events', () => {
    beforeEach(async () => {
      userResponse = await calculateUserResponse(O.some(userId));
    });

    it('returns nothing', () => {
      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one helpful response event', () => {
    beforeEach(async () => {
      await framework.commandHelpers.respond('respond-helpful', evaluationLocator, userId);
      userResponse = await calculateUserResponse(O.some(userId));
    });

    it('returns `helpful`', () => {
      expect(userResponse).toStrictEqual(O.some('helpful'));
    });
  });

  describe('one helpful response event from another user', () => {
    it('returns nothing', () => {
      userResponse = pipe(
        [
          userFoundReviewHelpful(arbitraryUserId(), evaluationLocator),
        ],
        projectUserReviewResponse(evaluationLocator, O.some(arbitraryUserId())),
      );

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one helpful response event for another review from the same user', () => {
    it('returns nothing', () => {
      userResponse = pipe(
        [
          userFoundReviewHelpful(userId, arbitraryEvaluationLocator()),
        ],
        projectUserReviewResponse(evaluationLocator, O.some(userId)),
      );

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('there is no user', () => {
    it('return nothing', () => {
      userResponse = pipe(
        [
          userFoundReviewHelpful(arbitraryUserId(), evaluationLocator),
        ],
        projectUserReviewResponse(evaluationLocator, O.none),
      );

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one revoked helpful response', () => {
    it('returns no-response', () => {
      userResponse = pipe(
        [
          userFoundReviewHelpful(userId, evaluationLocator),
          userRevokedFindingReviewHelpful(userId, evaluationLocator),
        ],
        projectUserReviewResponse(evaluationLocator, O.some(userId)),
      );

      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one revoked helpful response on a different review', () => {
    it('doesn\'t change the state of the current review', () => {
      const otherReviewId = arbitraryEvaluationLocator();
      userResponse = pipe(
        [
          userFoundReviewHelpful(userId, evaluationLocator),
          userFoundReviewHelpful(userId, otherReviewId),
          userRevokedFindingReviewHelpful(userId, otherReviewId),
        ],
        projectUserReviewResponse(evaluationLocator, O.some(userId)),
      );

      expect(userResponse).toStrictEqual(O.some('helpful'));
    });
  });

  describe('one not helpful response event', () => {
    it('returns `not helpful`', () => {
      userResponse = pipe(
        [
          userFoundReviewNotHelpful(userId, evaluationLocator),
        ],
        projectUserReviewResponse(evaluationLocator, O.some(userId)),
      );

      expect(userResponse).toStrictEqual(O.some('not-helpful'));
    });
  });

  describe('one revoked not-helpful response', () => {
    it('returns nothing', async () => {
      userResponse = pipe(
        [
          userFoundReviewNotHelpful(userId, evaluationLocator),
          userRevokedFindingReviewNotHelpful(userId, evaluationLocator),
        ],
        projectUserReviewResponse(evaluationLocator, O.some(userId)),
      );

      expect(userResponse).toStrictEqual(O.none);
    });
  });
});
