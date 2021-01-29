import * as O from 'fp-ts/Option';
import { createProjectUserReviewResponse } from '../../src/article-page/project-user-review-response';
import { Doi } from '../../src/types/doi';
import { generate } from '../../src/types/event-id';
import { toUserId } from '../../src/types/user-id';

describe('project-user-review-response', () => {
  describe('no response events', () => {
    it('returns nothing', async () => {
      const projectUserReviewResponse = createProjectUserReviewResponse(async () => []);
      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), O.some(toUserId('someone')));

      expect(userResponse.isNothing()).toBe(true);
    });
  });

  describe('one helpful response event', () => {
    it('returns `helpful`', async () => {
      const projectUserReviewResponse = createProjectUserReviewResponse(async () => [{
        type: 'UserFoundReviewHelpful',
        id: generate(),
        date: new Date(),
        userId: toUserId('user'),
        reviewId: new Doi('10.1111/123456'),
      }]);
      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), O.some(toUserId('user')));

      expect(userResponse.unsafelyUnwrap()).toBe('helpful');
    });
  });

  describe('one helpful response event from another user', () => {
    it('returns nothing', async () => {
      const projectUserReviewResponse = createProjectUserReviewResponse(async () => [{
        type: 'UserFoundReviewHelpful',
        id: generate(),
        date: new Date(),
        userId: toUserId('userA'),
        reviewId: new Doi('10.1111/123456'),
      }]);
      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), O.some(toUserId('userB')));

      expect(userResponse.isNothing()).toBe(true);
    });
  });

  describe('one helpful response event for another review from the same user', () => {
    it('returns nothing', async () => {
      const projectUserReviewResponse = createProjectUserReviewResponse(async () => [{
        type: 'UserFoundReviewHelpful',
        id: generate(),
        date: new Date(),
        userId: toUserId('user'),
        reviewId: new Doi('10.1111/987654'),
      }]);
      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), O.some(toUserId('user')));

      expect(userResponse.isNothing()).toBe(true);
    });
  });

  describe('there is no user', () => {
    it('return nothing', async () => {
      const projectUserReviewResponse = createProjectUserReviewResponse(async () => [{
        type: 'UserFoundReviewHelpful',
        id: generate(),
        date: new Date(),
        userId: toUserId('some-user'),
        reviewId: new Doi('10.1111/123456'),
      }]);

      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), O.none);

      expect(userResponse.isNothing()).toBe(true);
    });
  });

  describe('one revoked helpful response', () => {
    it('returns no-response', async () => {
      const userId = toUserId('some-user');
      const reviewId = new Doi('10.1111/123456');
      const projectUserReviewResponse = createProjectUserReviewResponse(async () => [
        {
          type: 'UserFoundReviewHelpful',
          id: generate(),
          date: new Date(),
          userId,
          reviewId,
        },
        {
          type: 'UserRevokedFindingReviewHelpful',
          id: generate(),
          date: new Date(),
          userId,
          reviewId,
        },
      ]);

      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), O.some(userId));

      expect(userResponse.isNothing()).toBe(true);
    });
  });

  describe('one revoked helpful response on a different review', () => {
    it('doesn\'t change the state of the current review', async () => {
      const userId = toUserId('some-user');
      const reviewId = new Doi('10.1111/123456');
      const otherReviewId = new Doi('10.1111/987654');
      const projectUserReviewResponse = createProjectUserReviewResponse(async () => [
        {
          type: 'UserFoundReviewHelpful',
          id: generate(),
          date: new Date(),
          userId,
          reviewId,
        },
        {
          type: 'UserFoundReviewHelpful',
          id: generate(),
          date: new Date(),
          userId,
          reviewId: otherReviewId,
        },
        {
          type: 'UserRevokedFindingReviewHelpful',
          id: generate(),
          date: new Date(),
          userId,
          reviewId: otherReviewId,
        },
      ]);

      const userResponse = await projectUserReviewResponse(reviewId, O.some(userId));

      expect(userResponse.unsafelyUnwrap()).toBe('helpful');
    });
  });

  describe('one not helpful response event', () => {
    it('returns `not helpful`', async () => {
      const projectUserReviewResponse = createProjectUserReviewResponse(async () => [{
        type: 'UserFoundReviewNotHelpful',
        id: generate(),
        date: new Date(),
        userId: toUserId('user'),
        reviewId: new Doi('10.1111/123456'),
      }]);
      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), O.some(toUserId('user')));

      expect(userResponse.unsafelyUnwrap()).toBe('not-helpful');
    });
  });

  describe('one revoked not-helpful response', () => {
    it('returns nothing', async () => {
      const userId = toUserId('some-user');
      const reviewId = new Doi('10.1111/123456');
      const projectUserReviewResponse = createProjectUserReviewResponse(async () => [
        {
          type: 'UserFoundReviewNotHelpful',
          id: generate(),
          date: new Date(),
          userId,
          reviewId,
        },
        {
          type: 'UserRevokedFindingReviewNotHelpful',
          id: generate(),
          date: new Date(),
          userId,
          reviewId,
        },
      ]);

      const userResponse = await projectUserReviewResponse(new Doi('10.1111/123456'), O.some(userId));

      expect(userResponse.isNothing()).toBe(true);
    });
  });
});
