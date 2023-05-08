import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
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

  describe('one helpful response event from a different user', () => {
    beforeEach(async () => {
      await framework.commandHelpers.respond('respond-helpful', evaluationLocator, arbitraryUserId());
      userResponse = await calculateUserResponse(O.some(userId));
    });

    it('returns nothing', () => {
      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one helpful response event for a different evaluation from the same user', () => {
    beforeEach(async () => {
      await framework.commandHelpers.respond('respond-helpful', arbitraryEvaluationLocator(), userId);
      userResponse = await calculateUserResponse(O.some(userId));
    });

    it('returns nothing', () => {
      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('there is no user', () => {
    beforeEach(async () => {
      await framework.commandHelpers.respond('respond-helpful', evaluationLocator, userId);
      userResponse = await calculateUserResponse(O.none);
    });

    it('return nothing', () => {
      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one revoked helpful response', () => {
    beforeEach(async () => {
      await framework.commandHelpers.respond('respond-helpful', evaluationLocator, userId);
      await framework.commandHelpers.respond('revoke-response', evaluationLocator, userId);
      userResponse = await calculateUserResponse(O.some(userId));
    });

    it('returns no-response', () => {
      expect(userResponse).toStrictEqual(O.none);
    });
  });

  describe('one revoked helpful response on a different evaluation', () => {
    const otherEvaluationLocator = arbitraryEvaluationLocator();

    beforeEach(async () => {
      await framework.commandHelpers.respond('respond-helpful', evaluationLocator, userId);
      await framework.commandHelpers.respond('respond-helpful', otherEvaluationLocator, userId);
      await framework.commandHelpers.respond('revoke-response', otherEvaluationLocator, userId);
      userResponse = await calculateUserResponse(O.some(userId));
    });

    it('doesn\'t change the state of the current evaluation', () => {
      expect(userResponse).toStrictEqual(O.some('helpful'));
    });
  });

  describe('one not helpful response event', () => {
    beforeEach(async () => {
      await framework.commandHelpers.respond('respond-not-helpful', evaluationLocator, userId);
      userResponse = await calculateUserResponse(O.some(userId));
    });

    it('returns `not helpful`', () => {
      expect(userResponse).toStrictEqual(O.some('not-helpful'));
    });
  });

  describe('one revoked not-helpful response', () => {
    beforeEach(async () => {
      await framework.commandHelpers.respond('respond-not-helpful', evaluationLocator, userId);
      await framework.commandHelpers.respond('revoke-response', evaluationLocator, userId);
      userResponse = await calculateUserResponse(O.some(userId));
    });

    it('returns nothing', async () => {
      expect(userResponse).toStrictEqual(O.none);
    });
  });
});
